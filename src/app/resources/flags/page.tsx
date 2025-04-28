'use client';

import { Box, Code, RefreshCw, SquareTerminal } from 'lucide-react';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { GradientBackground } from '@/components/ui/gradient-background';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { serverType } from '@/lib/flags/environment/serverType';
import { extraFlags } from '@/lib/flags/flags';
import { generateResult } from '@/lib/flags/generateResult';
import type { ExtraFlagType, flagsSchema } from '@/lib/flags/generateResult';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';

const defaults: flagsSchema = {
  operatingSystem: 'linux',
  serverType: 'paper',
  gui: true,
  variables: false,
  autoRestart: false,
  extraFlags: [],
  fileName: 'server.jar',
  flags: 'aikars',
  withResult: true,
  withFlags: false,
  memory: 4,
};

const flagOptions = [
  { name: 'None', value: 'none' },
  { name: "Aikar's Flags", value: 'aikars' },
  { name: "MeowIce's Flags", value: 'meowice' },
  { name: 'Benchmarked G1GC', value: 'benchmarkedG1GC' },
  { name: 'Benchmarked ZGC', value: 'benchmarkedZGC' },
  { name: 'Benchmarked Shenandoah', value: 'benchmarkedShenandoah' },
  { name: "Etil's Flags", value: 'etils' },
];

const environmentOptions = [
  { name: 'Linux', value: 'linux' },
  { name: 'Windows', value: 'windows' },
  { name: 'macOS', value: 'macos' },
  { name: 'Pterodactyl', value: 'pterodactyl' },
  { name: 'Command', value: 'command' },
];

const softwareOptions = [
  { name: 'Paper', value: 'paper' },
  { name: 'Purpur', value: 'purpur' },
  { name: 'Velocity', value: 'velocity' },
  { name: 'Waterfall', value: 'waterfall' },
];

export default function FlagsPage() {
  const [config, setConfig] = useState<flagsSchema>(defaults);

  const handleInputChange = (field: keyof flagsSchema, value: any) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleFileNameChange = (value: string) => {
    handleInputChange('fileName', value);
  };

  const handleFileNameBlur = () => {
    if (config.fileName && !config.fileName.endsWith('.jar')) {
      handleInputChange('fileName', config.fileName + '.jar');
    }
  };

  const getFileNameForScript = () => {
    return config.fileName || 'server.jar';
  };

  const handleExtraFlagToggle = (flag: ExtraFlagType) => {
    setConfig(prev => ({
      ...prev,
      extraFlags: prev.extraFlags.includes(flag) ? prev.extraFlags.filter(f => f !== flag) : [...prev.extraFlags, flag],
    }));
  };

  const copyToClipboard = async (text: string) => {
    if (typeof text !== 'string') {
      throw new Error("The 'text' parameter must be a string.");
    }

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }
    } catch (error) {
      console.error('Failed to copy text: ', error);
    }
  };

  const generatedScript = generateResult({ ...config, fileName: getFileNameForScript() }).script || '';

  return (
    <div className='relative min-h-screen'>
      <GradientBackground />
      <div className='mx-auto max-w-7xl px-6 py-16 pb-32 sm:px-8 sm:py-20 sm:pb-40 lg:px-12'>
        <header className='mx-auto max-w-3xl text-center'>
          <h1 className='text-3xl font-bold sm:text-4xl lg:text-5xl'>Flags Generator</h1>
          <p className='mt-4 text-neutral-300 sm:text-lg'>
            A simple script generator to start your Minecraft servers with optimal flags
          </p>
        </header>

        <div className='mt-12 grid gap-8 sm:grid-cols-2'>
          <Card className='p-6'>
            <h2 className='mb-4 text-xl font-semibold text-white'>Server Configuration</h2>
            <div className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='fileName'>File Name</Label>
                <Input
                  id='fileName'
                  value={config.fileName}
                  onChange={e => handleFileNameChange(e.target.value)}
                  onBlur={handleFileNameBlur}
                  placeholder='server.jar'
                />
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='environment'>Environment</Label>
                  <Select
                    value={config.operatingSystem}
                    onValueChange={value => handleInputChange('operatingSystem', value)}
                  >
                    <SelectTrigger id='environment'>
                      <SelectValue placeholder='Select environment' />
                    </SelectTrigger>
                    <SelectContent>
                      {environmentOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='software'>Software</Label>
                  <Select value={config.serverType} onValueChange={value => handleInputChange('serverType', value)}>
                    <SelectTrigger id='software'>
                      <SelectValue placeholder='Select software' />
                    </SelectTrigger>
                    <SelectContent>
                      {softwareOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className='space-y-2'>
                <Label>Memory (GB)</Label>
                <Slider
                  min={0.5}
                  max={32}
                  step={0.5}
                  value={[config.memory]}
                  onValueChange={([value]) => handleInputChange('memory', value)}
                />
                <div className='flex justify-between text-sm text-neutral-400'>
                  <span>0</span>
                  <span>8</span>
                  <span>16</span>
                  <span>24</span>
                  <span>32</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className='p-6'>
            <h2 className='mb-4 text-xl font-semibold text-white'>Flags & Options</h2>
            <div className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='flags'>Flags</Label>
                <div className='flex gap-2'>
                  <Select value={config.flags} onValueChange={value => handleInputChange('flags', value)}>
                    <SelectTrigger id='flags'>
                      <SelectValue placeholder='Select flags' />
                    </SelectTrigger>
                    <SelectContent>
                      {flagOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className='space-y-2'>
                <Label>Additional Options</Label>
                <div className='space-y-2'>
                  {config.serverType !== 'velocity' && config.serverType !== 'waterfall' && (
                    <div className='flex items-center space-x-2'>
                      <Checkbox
                        id='gui'
                        checked={config.gui}
                        onCheckedChange={checked => handleInputChange('gui', checked)}
                      />
                      <Label htmlFor='gui' className='flex items-center gap-2'>
                        <SquareTerminal className='h-4 w-4' /> No GUI
                      </Label>
                    </div>
                  )}
                  <div className='flex items-center space-x-2'>
                    <Checkbox
                      id='variables'
                      checked={config.variables}
                      onCheckedChange={checked => handleInputChange('variables', checked)}
                    />
                    <Label htmlFor='variables' className='flex items-center gap-2'>
                      <Code className='h-4 w-4' /> Use Variables
                    </Label>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <Checkbox
                      id='autoRestart'
                      checked={config.autoRestart}
                      onCheckedChange={checked => handleInputChange('autoRestart', checked)}
                    />
                    <Label htmlFor='autoRestart' className='flex items-center gap-2'>
                      <RefreshCw className='h-4 w-4' /> Auto-restart
                    </Label>
                  </div>
                </div>
              </div>

              {Object.entries(extraFlags)
                .filter(
                  ([id]) =>
                    extraFlags[id as ExtraFlagType].supports.includes(config.flags) &&
                    serverType[config.serverType].extraFlags?.includes(id as ExtraFlagType),
                )
                .map(([id, option]) => (
                  <div key={id} className='flex items-center space-x-2'>
                    <Checkbox
                      id={id}
                      checked={config.extraFlags.includes(id as ExtraFlagType)}
                      onCheckedChange={() => handleExtraFlagToggle(id as ExtraFlagType)}
                    />
                    <Label htmlFor={id} className='flex items-center gap-2'>
                      <Box className='h-4 w-4' /> {option.label}
                    </Label>
                  </div>
                ))}
            </div>
          </Card>
        </div>

        <div className='mt-8'>
          <Card className='p-6'>
            <h2 className='mb-4 text-xl font-semibold text-white'>Generated Script</h2>
            <div className='relative'>
              <textarea
                className='h-96 w-full rounded-lg border border-neutral-700 bg-neutral-800 p-4 font-mono text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none'
                readOnly
                value={generatedScript}
              />
              <Button
                className='absolute top-4 right-4'
                onClick={() => {
                  copyToClipboard(generatedScript);
                  toast.success('Copied script to clipboard!');
                }}
              >
                Copy
              </Button>
            </div>
          </Card>
        </div>
      </div>
      <Toaster richColors />
    </div>
  );
}
