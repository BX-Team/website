import type { ZodType } from 'zod';
import { z } from 'zod';

import type { AvailableConfig } from './config';
import { config } from './config';
import type { AvailableOperatingSystem } from './environment/operatingSystem';
import { defaultOperatingSystem, operatingSystem } from './environment/operatingSystem';
import type { AvailableServerType } from './environment/serverType';
import { defaultServerType, serverType } from './environment/serverType';

type GenerateConfigSchema = {
  [key in AvailableConfig]: ZodType;
};

const operatingSystemKeys = Object.keys(operatingSystem);
const serverTypeKeys = Object.keys(serverType);

export const BaseConfigValidation = z.object({
  operatingSystem: z.enum(operatingSystemKeys as [string, ...string[]]).default(defaultOperatingSystem as string),
  serverType: z.enum(serverTypeKeys as [string, ...string[]]).default(defaultServerType as string),
  withHTML: z.boolean().default(false),
  withFlags: z.boolean().default(true),
  withResult: z.boolean().default(true),
});

export function generateConfigSchema(
  requestOperatingSystem: AvailableOperatingSystem,
  requestServerType: AvailableServerType,
) {
  const schema: GenerateConfigSchema = {};

  const selectedOperatingSystem = operatingSystem[requestOperatingSystem];
  const selectedServerType = serverType[requestServerType];

  for (const [key, value] of Object.entries(config)) {
    // Config option not supported
    if (!selectedOperatingSystem.config.includes(key) || !selectedServerType.config.includes(key)) {
      schema[key] = z.never().optional();
      continue;
    }

    schema[key] = value.type.default(value.default);
  }

  schema.flags = z.enum(selectedServerType.flags as [string, ...string[]]).default(selectedServerType.default.flags);

  schema.extraFlags =
    !selectedServerType.extraFlags || selectedServerType.extraFlags.length === 0
      ? z.never().optional()
      : z
          .array(z.enum(selectedServerType.extraFlags as [string, ...string[]]))
          .default(selectedServerType.default.extraFlags ?? []);

  return BaseConfigValidation.extend(schema);
}
