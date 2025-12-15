'use client';

import { ChevronDown, ChevronRight, Search, X } from 'lucide-react';
import type React from 'react';
import { useMemo, useState } from 'react';

interface ConfigViewerProps {
  config: Record<string, any>;
  comments?: Record<string, string>;
  title?: string;
}

const ConfigViewer = ({ config, comments = {}, title = 'Configuration' }: ConfigViewerProps) => {
  const [visibleComments, setVisibleComments] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredConfig = useMemo(() => {
    if (!searchQuery.trim()) return config;

    const filterObject = (obj: any, path: string = ''): any => {
      const result: any = {};

      Object.entries(obj).forEach(([key, value]) => {
        const currentPath = path ? `${path}.${key}` : key;
        const matchesSearch =
          key.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (typeof value === 'string' && value.toLowerCase().includes(searchQuery.toLowerCase())) ||
          currentPath.toLowerCase().includes(searchQuery.toLowerCase());

        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          const filteredNested = filterObject(value, currentPath);
          if (Object.keys(filteredNested).length > 0 || matchesSearch) {
            result[key] = matchesSearch ? value : filteredNested;
          }
        } else if (matchesSearch) {
          result[key] = value;
        }
      });

      return result;
    };

    return filterObject(config);
  }, [config, searchQuery]);

  const toggleComment = (path: string) => {
    const newVisible = new Set(visibleComments);
    if (newVisible.has(path)) {
      newVisible.delete(path);
    } else {
      newVisible.add(path);
    }
    setVisibleComments(newVisible);
  };

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;

    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className='bg-fd-primary/20 text-fd-primary px-1 py-0.5 rounded-sm font-medium'>
          {part}
        </mark>
      ) : (
        part
      ),
    );
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const renderComment = (comment?: string, path?: string, depth: number = 0) => {
    if (!comment || !path || !visibleComments.has(path)) return null;

    const indentSpaces = '  '.repeat(depth);

    return (
      <div
        className='mt-1 mb-1 text-sm text-white px-3 py-2'
        style={{
          backgroundColor: '#202127',
          marginLeft: `${depth * 1.5}rem`,
        }}
      >
        <span style={{ whiteSpace: 'pre-wrap' }}>{comment}</span>
      </div>
    );
  };

  const renderValue = (value: any, path: string, key: string, depth: number = 0): React.ReactElement => {
    const comment = comments[path];
    const indentSpaces = '  '.repeat(depth);

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      return (
        <div key={path} className='mb-0'>
          <div className='flex items-center hover:bg-fd-muted/20 py-0.5 px-2 transition-all duration-200 group'>
            <span className='font-mono text-sm text-fd-foreground whitespace-pre'>
              {indentSpaces}
              {key}:
            </span>
            {comment && (
              <button
                onClick={() => toggleComment(path)}
                className='ml-2 text-xs text-fd-muted-foreground hover:text-fd-foreground flex-shrink-0'
              >
                {visibleComments.has(path) ? (
                  <ChevronDown className='w-3 h-3 inline' />
                ) : (
                  <ChevronRight className='w-3 h-3 inline' />
                )}
              </button>
            )}
          </div>
          {comment && renderComment(comment, path, depth)}
          <div>
            {Object.entries(value).map(([subKey, subValue]) =>
              renderValue(subValue, `${path}.${subKey}`, subKey, depth + 1),
            )}
          </div>
        </div>
      );
    }

    if (Array.isArray(value)) {
      if (value.length === 0) {
        return (
          <div key={path} className='mb-0'>
            <div className='flex items-center hover:bg-fd-muted/20 py-0.5 px-2 transition-all duration-200 group'>
              <span className='font-mono text-sm text-fd-foreground whitespace-pre'>
                {indentSpaces}
                {key}: []
              </span>
              {comment && (
                <button
                  onClick={() => toggleComment(path)}
                  className='ml-2 text-xs text-fd-muted-foreground hover:text-fd-foreground flex-shrink-0'
                >
                  {visibleComments.has(path) ? (
                    <ChevronDown className='w-3 h-3 inline' />
                  ) : (
                    <ChevronRight className='w-3 h-3 inline' />
                  )}
                </button>
              )}
            </div>
            {comment && renderComment(comment, path, depth)}
          </div>
        );
      }

      return (
        <div key={path} className='mb-0'>
          <div className='flex items-center hover:bg-fd-muted/20 py-0.5 px-2 transition-all duration-200 group'>
            <span className='font-mono text-sm text-fd-foreground whitespace-pre'>
              {indentSpaces}
              {key}:
            </span>
            {comment && (
              <button
                onClick={() => toggleComment(path)}
                className='ml-2 text-xs text-fd-muted-foreground hover:text-fd-foreground flex-shrink-0'
              >
                {visibleComments.has(path) ? (
                  <ChevronDown className='w-3 h-3 inline' />
                ) : (
                  <ChevronRight className='w-3 h-3 inline' />
                )}
              </button>
            )}
          </div>
          {comment && renderComment(comment, path, depth)}
          <div>
            {value.map((item, index) => (
              <div key={index} className='font-mono text-sm text-amber-500 dark:text-amber-400 whitespace-pre pl-2'>
                {indentSpaces} - "{typeof item === 'object' ? JSON.stringify(item) : String(item)}"
              </div>
            ))}
          </div>
        </div>
      );
    }

    const getValueColor = (val: any) => {
      if (typeof val === 'boolean') {
        return val ? 'text-emerald-500 dark:text-emerald-400' : 'text-red-400 dark:text-red-400';
      }
      if (typeof val === 'number') {
        return 'text-violet-500 dark:text-violet-400';
      }
      if (typeof val === 'string') {
        return 'text-amber-500 dark:text-amber-400';
      }
      return 'text-fd-foreground';
    };

    const formatValue = (val: any) => {
      if (typeof val === 'string') {
        return val === '' ? '""' : `"${val}"`;
      }
      return String(val);
    };

    return (
      <div key={path} className='mb-0'>
        <div className='flex items-center hover:bg-fd-muted/20 py-0.5 px-2 transition-all duration-200 group'>
          <span className='font-mono text-sm text-fd-foreground whitespace-pre'>
            {indentSpaces}
            {highlightText(key, searchQuery)}:{' '}
          </span>
          <span className={`font-mono text-sm ${getValueColor(value)} whitespace-nowrap`}>
            {highlightText(formatValue(value), searchQuery)}
          </span>
          {comment && (
            <button
              onClick={() => toggleComment(path)}
              className='ml-2 text-xs text-fd-muted-foreground hover:text-fd-foreground flex-shrink-0'
            >
              {visibleComments.has(path) ? (
                <ChevronDown className='w-3 h-3 inline' />
              ) : (
                <ChevronRight className='w-3 h-3 inline' />
              )}
            </button>
          )}
        </div>
        {comment && renderComment(comment, path, depth)}
      </div>
    );
  };

  return (
    <div className='bg-fd-card border border-fd-border rounded-lg shadow-sm overflow-hidden'>
      <div className='border-b border-fd-border p-6'>
        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
          <h3 className='text-lg font-semibold text-fd-foreground'>{title}</h3>
          <div className='flex gap-1.5'>
            <button
              onClick={() => setVisibleComments(new Set(Object.keys(comments)))}
              className='px-2 py-1 text-xs bg-fd-primary/10 text-fd-primary rounded hover:bg-fd-primary/20 transition-all duration-200 font-medium hover:scale-105'
            >
              Show all comments
            </button>
            <button
              onClick={() => setVisibleComments(new Set())}
              className='px-2 py-1 text-xs bg-fd-muted text-fd-muted-foreground rounded hover:bg-fd-muted/80 transition-all duration-200 font-medium hover:scale-105'
            >
              Hide all comments
            </button>
          </div>
        </div>
        <div className='relative mt-4'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-fd-muted-foreground' />
          <input
            type='text'
            placeholder='Search configuration keys and values...'
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className='w-full pl-10 pr-10 py-2.5 border border-fd-border rounded-md bg-fd-background text-fd-foreground placeholder-fd-muted-foreground focus:outline-none focus:ring-2 focus:ring-fd-primary/20 focus:border-fd-primary transition-all duration-200'
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className='absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-fd-muted-foreground hover:text-fd-foreground transition-colors duration-200'
            >
              <X className='w-4 h-4' />
            </button>
          )}
        </div>
      </div>
      <div className='p-3 overflow-x-auto overflow-y-visible'>
        {Object.keys(filteredConfig).length === 0 ? (
          <div className='text-center text-fd-muted-foreground py-8'>
            <Search className='w-6 h-6 mx-auto mb-2 opacity-50' />
            <p className='text-sm'>No configuration settings found matching "{searchQuery}"</p>
            <p className='text-xs mt-1 opacity-75'>Try searching for a different term or clear the search</p>
          </div>
        ) : (
          <div className='space-y-0 font-mono text-sm leading-relaxed'>
            {Object.entries(filteredConfig).map(([key, value]) => renderValue(value, key, key))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfigViewer;
