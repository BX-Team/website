'use client';

import axios from 'axios';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import React, { useEffect, useState } from 'react';

interface Command {
  name: string;
  permissions: string[];
  descriptions: string[];
  arguments: string[];
}

const CommandsTable: React.FC = () => {
  const [commands, setCommands] = useState<Command[]>([]);

  useEffect(() => {
    const commandsUrl = 'https://raw.githubusercontent.com/BX-Team/Nexus/refs/heads/master/assets/commands.json';

    const fetchCommands = async () => {
      try {
        const response = await axios.get<Command[]>(commandsUrl);
        setCommands(response.data);
      } catch (error) {
        console.error('Error fetching commands:', error);
      }
    };

    fetchCommands();
  }, []);

  const copyToClipboard = async (text: string) => {
    if (typeof text !== 'string') {
      throw new Error("The 'text' parameter must be a string.");
    }

    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied permission to clipboard!');
    } catch (error) {
      console.error('Failed to copy text: ', error);
    }
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Arguments</th>
            <th>Description</th>
            <th>Permissions (Click to copy)</th>
          </tr>
        </thead>
        <tbody>
          {commands.map((command, commandIndex) => (
            <tr key={`${command.name}-${commandIndex}`}>
              <td>{command.name}</td>
              <td>{command.arguments.join(', ')}</td>
              <td>{command.descriptions.join(', ')}</td>
              <td>
                <div>
                  {command.permissions.map((permission, permissionIndex) => (
                    <React.Fragment key={`${command.name}-${permission.trim()}-${permissionIndex}`}>
                      <button onClick={() => copyToClipboard(permission)}>{permission}</button>
                      {permissionIndex < command.permissions.length - 1 && ', '}
                    </React.Fragment>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ToastContainer
        position='bottom-right'
        autoClose={2000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='colored'
        transition={Bounce}
      />
    </div>
  );
};

export default CommandsTable;
