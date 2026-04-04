import type { EnvironmentOption } from './EnvironmentOption';

export interface EnvironmentOptions<OptionType = EnvironmentOption> {
  readonly [key: string]: OptionType;
}
