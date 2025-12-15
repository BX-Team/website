import { operatingSystem } from './environment/operatingSystem';
import { serverType } from './environment/serverType';
import { extraFlags, flags } from './flags';

export type ExtraFlagType = 'vectors' | 'benchmarkedGraalVM' | 'meowiceGraalVM';

export type AvailableFlags =
  | 'none'
  | 'aikars'
  | 'meowice'
  | 'benchmarkedG1GC'
  | 'benchmarkedZGC'
  | 'benchmarkedShenandoah'
  | 'etils'
  | 'proxy';

export interface flagsSchema {
  operatingSystem: string;
  serverType: string;
  gui: boolean;
  variables: boolean;
  autoRestart: boolean;
  extraFlags: ExtraFlagType[];
  fileName: string;
  flags: AvailableFlags;
  withResult: boolean;
  withFlags: boolean;
  memory: number;
}

export interface GenerateResult {
  script: string;
  flags?: string;
}

export function generateResult(parsed: flagsSchema): GenerateResult {
  const selectedFlags = flags[parsed.flags];
  let generatedFlags: string[] = selectedFlags.generate(parsed);

  const selectedServerType = serverType[parsed.serverType];

  generatedFlags =
    selectedServerType.generate?.({
      ...parsed,
      existingFlags: generatedFlags,
    }) ?? generatedFlags;

  if (parsed.extraFlags) {
    for (const currentFlags of parsed.extraFlags) {
      if (
        !extraFlags[currentFlags].supports.includes(parsed.flags) ||
        !selectedServerType.extraFlags?.includes(currentFlags)
      )
        continue;
      const selectedFlags = extraFlags[currentFlags];

      generatedFlags =
        selectedFlags.generate({
          existingFlags: generatedFlags,
        }) ?? generatedFlags;
    }
  }

  const selectedOperatingSystem = operatingSystem[parsed.operatingSystem];
  const result =
    selectedOperatingSystem.generate({
      ...parsed,
      existingFlags: generatedFlags,
    }) ?? generatedFlags;

  const data: GenerateResult = {
    script: result.script,
  };

  if (parsed.withFlags) {
    data.flags = result.flags.join(' ');
  }

  return data;
}
