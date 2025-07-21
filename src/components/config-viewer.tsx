'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { ChevronDown, ChevronRight, Search, X } from 'lucide-react';

interface ConfigSection {
  key: string;
  value: any;
  comment?: string;
  description?: string;
}

interface ConfigViewerProps {
  config: Record<string, any>;
  comments?: Record<string, string>;
  title?: string;
}

const ConfigViewer = ({ config, comments = {}, title = 'Configuration' }: ConfigViewerProps) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [visibleComments, setVisibleComments] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const allPaths = new Set<string>();
    const collectPaths = (obj: any, currentPath: string = '') => {
      Object.keys(obj).forEach(key => {
        const path = currentPath ? `${currentPath}.${key}` : key;
        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
          allPaths.add(path);
          collectPaths(obj[key], path);
        }
      });
    };
    collectPaths(config);
    setExpandedSections(allPaths);
  }, [config]);

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

  const toggleSection = (path: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedSections(newExpanded);
  };

  const toggleComment = (path: string) => {
    const newVisible = new Set(visibleComments);
    if (newVisible.has(path)) {
      newVisible.delete(path);
    } else {
      newVisible.add(path);
    }
    setVisibleComments(newVisible);
  };

  const expandAll = () => {
    const allPaths = new Set<string>();
    const collectPaths = (obj: any, currentPath: string = '') => {
      Object.keys(obj).forEach(key => {
        const path = currentPath ? `${currentPath}.${key}` : key;
        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
          allPaths.add(path);
          collectPaths(obj[key], path);
        }
      });
    };
    collectPaths(filteredConfig);
    setExpandedSections(allPaths);
    setVisibleComments(new Set(Object.keys(comments)));
  };

  const collapseAll = () => {
    setExpandedSections(new Set());
    setVisibleComments(new Set());
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

  const renderComment = (comment?: string, path?: string) => {
    if (!comment || !path || !visibleComments.has(path)) return null;

    return (
      <div
        className='ml-0 mt-1 text-xs text-fd-foreground border-l-2 border-fd-primary/30 px-2 py-1'
        style={{ backgroundColor: '#202127' }}
      >
        <span>{comment}</span>
      </div>
    );
  };

  const renderValue = (value: any, path: string, key: string, depth: number = 0): React.ReactElement => {
    const isExpanded = expandedSections.has(path);
    const indentClass = `ml-${Math.min(depth, 3)}`;
    const comment = comments[path];

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      return (
        <div key={path} className={`${depth > 0 ? indentClass : ''} mb-1`}>
          <div
            className='flex items-center cursor-pointer hover:bg-fd-muted/30 py-1 px-2 transition-all duration-200 group'
            onClick={() => (comment ? toggleComment(path) : toggleSection(path))}
          >
            <div className='transition-transform duration-200 mr-1'>
              {isExpanded ? (
                <ChevronDown className='w-3 h-3 text-fd-muted-foreground group-hover:text-fd-foreground' />
              ) : (
                <ChevronRight className='w-3 h-3 text-fd-muted-foreground group-hover:text-fd-foreground' />
              )}
            </div>
            <span className='text-sm text-fd-primary group-hover:text-fd-primary/80'>
              {highlightText(key, searchQuery)}:
            </span>
            {comment && (
              <span className='ml-1 text-xs text-fd-muted-foreground'>
                {visibleComments.has(path) ? (
                  <ChevronDown className='w-3 h-3 inline' />
                ) : (
                  <ChevronRight className='w-3 h-3 inline' />
                )}
              </span>
            )}
          </div>
          {comment && renderComment(comment, path)}
          {isExpanded && (
            <div className='ml-3 border-l border-fd-border/50 pl-2 mt-1'>
              {Object.entries(value).map(([subKey, subValue]) =>
                renderValue(subValue, `${path}.${subKey}`, subKey, depth + 1),
              )}
            </div>
          )}
        </div>
      );
    }

    if (Array.isArray(value)) {
      return (
        <div key={path} className={`${depth > 0 ? indentClass : ''} mb-1`}>
          <div
            className='flex items-start py-1 px-2 hover:bg-fd-muted/30 transition-all duration-200 group cursor-pointer'
            onClick={() => (comment ? toggleComment(path) : undefined)}
          >
            <span className='text-sm text-emerald-600 dark:text-emerald-400 mr-1 flex-shrink-0'>
              {highlightText(key, searchQuery)}:
            </span>
            <div className='flex flex-wrap gap-1 min-w-0 flex-1'>
              {value.length === 0 ? (
                <span className='text-fd-muted-foreground italic text-xs'>[]</span>
              ) : (
                value.map((item, index) => (
                  <span key={index} className='text-fd-foreground bg-fd-muted/50 px-1 py-0.5 rounded text-xs'>
                    {typeof item === 'object'
                      ? JSON.stringify(item)
                      : typeof item === 'string'
                        ? highlightText(String(item), searchQuery)
                        : String(item)}
                  </span>
                ))
              )}
            </div>
            {comment && (
              <span className='ml-1 text-xs text-fd-muted-foreground'>
                {visibleComments.has(path) ? (
                  <ChevronDown className='w-3 h-3 inline' />
                ) : (
                  <ChevronRight className='w-3 h-3 inline' />
                )}
              </span>
            )}
          </div>
          {comment && renderComment(comment, path)}
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

    return (
      <div key={path} className={`${depth > 0 ? indentClass : ''} mb-1`}>
        <div
          className='flex items-center py-1 px-2 hover:bg-fd-muted/30 transition-all duration-200 group cursor-pointer'
          onClick={() => (comment ? toggleComment(path) : undefined)}
        >
          <span className='text-sm text-fd-foreground mr-1 min-w-0 flex-shrink-0'>
            {highlightText(key, searchQuery)}:
          </span>
          <span className={`${getValueColor(value)} break-all flex-1 min-w-0 text-sm`}>
            {typeof value === 'string' && value === '' ? (
              <span className='text-fd-muted-foreground italic text-xs'>""</span>
            ) : (
              <span>{typeof value === 'string' ? highlightText(value, searchQuery) : String(value)}</span>
            )}
          </span>
          {comment && (
            <span className='ml-1 text-xs text-fd-muted-foreground'>
              {visibleComments.has(path) ? (
                <ChevronDown className='w-3 h-3 inline' />
              ) : (
                <ChevronRight className='w-3 h-3 inline' />
              )}
            </span>
          )}
        </div>
        {comment && renderComment(comment, path)}
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
              onClick={expandAll}
              className='px-2 py-1 text-xs bg-fd-primary/10 text-fd-primary rounded hover:bg-fd-primary/20 transition-all duration-200 font-medium hover:scale-105'
            >
              Expand all
            </button>
            <button
              onClick={collapseAll}
              className='px-2 py-1 text-xs bg-fd-muted text-fd-muted-foreground rounded hover:bg-fd-muted/80 transition-all duration-200 font-medium hover:scale-105'
            >
              Collapse all
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
      <div className='p-3 overflow-visible'>
        {Object.keys(filteredConfig).length === 0 ? (
          <div className='text-center text-fd-muted-foreground py-8'>
            <Search className='w-6 h-6 mx-auto mb-2 opacity-50' />
            <p className='text-sm'>No configuration settings found matching "{searchQuery}"</p>
            <p className='text-xs mt-1 opacity-75'>Try searching for a different term or clear the search</p>
          </div>
        ) : (
          <div className='space-y-0'>
            {Object.entries(filteredConfig).map(([key, value]) => renderValue(value, key, key))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfigViewer;
