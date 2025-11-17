import type { AvailableConfig } from '@/lib/flags/config';
import type { AvailableExtraFlags, AvailableFlags } from '@/lib/flags/flags';
import type { EnvironmentOptions } from '@/lib/flags/interface/environment/EnvironmentOptions';
import type { ServerTypeOption } from '@/lib/flags/interface/environment/ServerTypeOption';

export type AvailableServerType = keyof typeof serverType;

interface SharedFlags<T = AvailableFlags> {
  [key: string]: T[];
}

const sharedConfig: AvailableConfig[] = ['fileName', 'flags', 'memory', 'autoRestart', 'variables'];

const sharedFlags: SharedFlags = {
  bukkit: [
    'none',
    'aikars',
    'benchmarkedG1GC',
    'benchmarkedZGC',
    'benchmarkedShenandoah',
    'etils',
  ],
  proxy: ['none', 'proxy'],
};

const sharedExtraFlags: SharedFlags<AvailableExtraFlags> = {
  bukkit: ['benchmarkedGraalVM', 'meowiceGraalVM'],
};

export const serverType: EnvironmentOptions<ServerTypeOption> = {
  paper: {
    icon: 'IconBucket',
    flags: [...sharedFlags.bukkit],
    extraFlags: [...sharedExtraFlags.bukkit],
    default: {
      flags: 'aikars',
    },
    config: [...sharedConfig, 'gui'],
  },
  purpur: {
    icon: 'IconBucket',
    flags: [...sharedFlags.bukkit],
    extraFlags: [...sharedExtraFlags.bukkit, 'vectors'],
    default: {
      flags: 'aikars',
      extraFlags: ['vectors'],
    },
    config: [...sharedConfig, 'extraFlags', 'gui'],
  },
  velocity: {
    icon: 'IconNetwork',
    flags: [...sharedFlags.proxy],
    default: {
      flags: 'proxy',
    },
    config: [...sharedConfig],
  },
  waterfall: {
    icon: 'IconNetwork',
    default: {
      flags: 'proxy',
    },
    flags: [...sharedFlags.proxy],
    config: [...sharedConfig],
  },
};

export const defaultServerType: AvailableServerType = 'paper';
