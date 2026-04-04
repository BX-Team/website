import type { AvailableConfig } from '../../config';
import type { GenerateOperatingSystem } from '../generate/GenerateOperatingSystem';
import type { EnvironmentOption } from './EnvironmentOption';

interface File {
  name?: string;
  mime: string;
  extension: string;
}

export interface OperatingSystemOption extends EnvironmentOption {
  file: File | false;
  generate: GenerateOperatingSystem<AvailableConfig | 'existingFlags'>;
}
