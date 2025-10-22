import type { AvailableServerType } from '../../environment/serverType';
import type { AvailableExtraFlags, AvailableFlags } from '../../flags';
import type { Generate } from '../generate/Generate';
import type { EnvironmentOption } from './EnvironmentOption';

export interface ServerTypeOption extends EnvironmentOption {
  flags: AvailableFlags[];
  extraFlags?: AvailableExtraFlags[];
  default: {
    flags: AvailableFlags;
    extraFlags?: AvailableExtraFlags[];
  };
  generate?: Generate<AvailableServerType | 'existingFlags'>;
}
