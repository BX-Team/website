import type { AvailableConfig } from './config';
import type { AvailableOperatingSystem } from './environment/operatingSystem';
import type { AvailableServerType } from './environment/serverType';
import type { ExtraFlagType } from './generateResult';
import { Generate } from './interface/generate/Generate';

export type AvailableFlags = keyof typeof flags;
export type AvailableExtraFlags = keyof typeof extraFlags;

interface FlagOption {
  generate: Generate<AvailableConfig & AvailableOperatingSystem & AvailableServerType>;
}

export type SupportedFlagType =
  | 'aikars'
  | 'meowice'
  | 'benchmarkedG1GC'
  | 'benchmarkedZGC'
  | 'benchmarkedShenandoah'
  | 'hillttys'
  | 'obyduxs'
  | 'etils'
  | 'proxy'
  | 'none';

export interface FlagExtraOption {
  label: string;
  description: string;
  supports: SupportedFlagType[];
  generate: (params: { existingFlags: string[] }) => string[];
}

const baseAikar = [
  '-XX:+UseG1GC',
  '-XX:+ParallelRefProcEnabled',
  '-XX:MaxGCPauseMillis=200',
  '-XX:+UnlockExperimentalVMOptions',
  '-XX:+DisableExplicitGC',
  '-XX:+AlwaysPreTouch',
  '-XX:G1HeapWastePercent=5',
  '-XX:G1MixedGCCountTarget=4',
  '-XX:InitiatingHeapOccupancyPercent=15',
  '-XX:G1MixedGCLiveThresholdPercent=90',
  '-XX:G1RSetUpdatingPauseTimePercent=5',
  '-XX:SurvivorRatio=32',
  '-XX:+PerfDisableSharedMem',
  '-XX:MaxTenuringThreshold=1',
  '-Dusing.aikars.flags=https://mcflags.emc.gs',
  '-Daikars.new.flags=true',
];

const baseBenchmarked = [
  '-XX:+UnlockExperimentalVMOptions',
  '-XX:+UnlockDiagnosticVMOptions',
  '-XX:+AlwaysActAsServerClassMachine',
  '-XX:+AlwaysPreTouch',
  '-XX:+DisableExplicitGC',
  '-XX:+UseNUMA',
  '-XX:NmethodSweepActivity=1',
  '-XX:ReservedCodeCacheSize=400M',
  '-XX:NonNMethodCodeHeapSize=12M',
  '-XX:ProfiledCodeHeapSize=194M',
  '-XX:NonProfiledCodeHeapSize=194M',
  '-XX:-DontCompileHugeMethods',
  '-XX:MaxNodeLimit=240000',
  '-XX:NodeLimitFudgeFactor=8000',
  '-XX:+UseVectorCmov',
  '-XX:+PerfDisableSharedMem',
  '-XX:+UseFastUnorderedTimeStamps',
  '-XX:+UseCriticalJavaThreadPriority',
  '-XX:ThreadPriorityPolicy=1',
  '-XX:AllocatePrefetchStyle=3',
];

const baseEtil = [
  '-XX:+UseG1GC',
  '-XX:+ParallelRefProcEnabled',
  '-XX:MaxGCPauseMillis=200',
  '-XX:+UnlockExperimentalVMOptions',
  '-XX:+UnlockDiagnosticVMOptions',
  '-XX:+DisableExplicitGC',
  '-XX:+AlwaysPreTouch',
  '-XX:G1HeapWastePercent=5',
  '-XX:G1MixedGCCountTarget=4',
  '-XX:G1MixedGCLiveThresholdPercent=90',
  '-XX:G1RSetUpdatingPauseTimePercent=5',
  '-XX:SurvivorRatio=32',
  '-XX:+PerfDisableSharedMem',
  '-XX:MaxTenuringThreshold=1',
  '-XX:-UseBiasedLocking',
  '-XX:UseAVX=3',
  '-XX:+UseStringDeduplication',
  '-XX:+UseFastUnorderedTimeStamps',
  '-XX:+UseAES',
  '-XX:+UseAESIntrinsics',
  '-XX:UseSSE=4',
  '-XX:+UseFMA',
  '-XX:AllocatePrefetchStyle=1',
  '-XX:+UseLoopPredicate',
  '-XX:+RangeCheckElimination',
  '-XX:+EliminateLocks',
  '-XX:+DoEscapeAnalysis',
  '-XX:+UseCodeCacheFlushing',
  '-XX:+SegmentedCodeCache',
  '-XX:+UseFastJNIAccessors',
  '-XX:+OptimizeStringConcat',
  '-XX:+UseCompressedOops',
  '-XX:+UseThreadPriorities',
  '-XX:+OmitStackTraceInFastThrow',
  '-XX:+TrustFinalNonStaticFields',
  '-XX:ThreadPriorityPolicy=1',
  '-XX:+UseInlineCaches',
  '-XX:+RewriteBytecodes',
  '-XX:+RewriteFrequentPairs',
  '-XX:+UseNUMA',
  '-XX:-DontCompileHugeMethods',
  '-XX:+UseFPUForSpilling',
  '-XX:+UseFastStosb',
  '-XX:+UseNewLongLShift',
  '-XX:+UseVectorCmov',
  '-XX:+UseXMMForArrayCopy',
  '-XX:+UseXmmI2D',
  '-XX:+UseXmmI2F',
  '-XX:+UseXmmLoadAndClearUpper',
  '-XX:+UseXmmRegToRegMoveAll',
  '-Xlog:async',
  '-Djava.security.egd=file:/dev/urandom',
];

export const flags = {
  aikars: {
    generate: ({ memory }) => {
      return [
        ...baseAikar,
        ...(memory < 12
          ? [
              '-XX:G1NewSizePercent=30',
              '-XX:G1MaxNewSizePercent=40',
              '-XX:G1HeapRegionSize=8M',
              '-XX:G1ReservePercent=20',
            ]
          : [
              '-XX:G1NewSizePercent=40',
              '-XX:G1MaxNewSizePercent=50',
              '-XX:G1HeapRegionSize=16M',
              '-XX:G1ReservePercent=15',
            ]),
      ];
    },
  } as FlagOption,
  meowice: {
    generate: () => {
      return [
        '-XX:+UseG1GC',
        '-XX:MaxGCPauseMillis=200',
        '-XX:+UnlockExperimentalVMOptions',
        '-XX:+UnlockDiagnosticVMOptions',
        '-XX:+DisableExplicitGC',
        '-XX:+AlwaysPreTouch',
        '-XX:G1NewSizePercent=28',
        '-XX:G1MaxNewSizePercent=50',
        '-XX:G1HeapRegionSize=16M',
        '-XX:G1ReservePercent=15',
        '-XX:G1MixedGCCountTarget=3',
        '-XX:InitiatingHeapOccupancyPercent=20',
        '-XX:G1MixedGCLiveThresholdPercent=90',
        '-XX:SurvivorRatio=32',
        '-XX:G1HeapWastePercent=5',
        '-XX:MaxTenuringThreshold=1',
        '-XX:+PerfDisableSharedMem',
        '-XX:G1SATBBufferEnqueueingThresholdPercent=30',
        '-XX:G1ConcMarkStepDurationMillis=5',
        '-XX:G1RSetUpdatingPauseTimePercent=0',
        '-XX:+UseNUMA',
        '-XX:-DontCompileHugeMethods',
        '-XX:MaxNodeLimit=240000',
        '-XX:NodeLimitFudgeFactor=8000',
        '-XX:ReservedCodeCacheSize=400M',
        '-XX:NonNMethodCodeHeapSize=12M',
        '-XX:ProfiledCodeHeapSize=194M',
        '-XX:NonProfiledCodeHeapSize=194M',
        '-XX:NmethodSweepActivity=1',
        '-XX:+UseFastUnorderedTimeStamps',
        '-XX:+UseCriticalJavaThreadPriority',
        '-XX:AllocatePrefetchStyle=3',
        '-XX:+AlwaysActAsServerClassMachine',
        '-XX:+UseTransparentHugePages',
        '-XX:LargePageSizeInBytes=2M',
        '-XX:+UseLargePages',
        '-XX:+EagerJVMCI',
        '-XX:+UseStringDeduplication',
        '-XX:+UseAES',
        '-XX:+UseAESIntrinsics',
        '-XX:+UseFMA',
        '-XX:+UseLoopPredicate',
        '-XX:+RangeCheckElimination',
        '-XX:+OptimizeStringConcat',
        '-XX:+UseCompressedOops',
        '-XX:+UseThreadPriorities',
        '-XX:+OmitStackTraceInFastThrow',
        '-XX:+RewriteBytecodes',
        '-XX:+RewriteFrequentPairs',
        '-XX:+UseFPUForSpilling',
        '-XX:+UseFastStosb',
        '-XX:+UseNewLongLShift',
        '-XX:+UseVectorCmov',
        '-XX:+UseXMMForArrayCopy',
        '-XX:+UseXmmI2D',
        '-XX:+UseXmmI2F',
        '-XX:+UseXmmLoadAndClearUpper',
        '-XX:+UseXmmRegToRegMoveAll',
        '-XX:+EliminateLocks',
        '-XX:+DoEscapeAnalysis',
        '-XX:+AlignVector',
        '-XX:+OptimizeFill',
        '-XX:+EnableVectorSupport',
        '-XX:+UseCharacterCompareIntrinsics',
        '-XX:+UseCopySignIntrinsic',
        '-XX:+UseVectorStubs',
        '-XX:UseAVX=2',
        '-XX:UseSSE=4',
        '-XX:+UseFastJNIAccessors',
        '-XX:+UseInlineCaches',
        '-XX:+SegmentedCodeCache',
      ];
    },
  } as FlagOption,
  benchmarkedG1GC: {
    generate: () => {
      return [
        ...baseBenchmarked,
        '-XX:+UseG1GC',
        '-XX:MaxGCPauseMillis=130',
        '-XX:+UnlockExperimentalVMOptions',
        '-XX:+DisableExplicitGC',
        '-XX:+AlwaysPreTouch',
        '-XX:G1NewSizePercent=28',
        '-XX:G1HeapRegionSize=16M',
        '-XX:G1ReservePercent=20',
        '-XX:G1MixedGCCountTarget=3',
        '-XX:InitiatingHeapOccupancyPercent=10',
        '-XX:G1MixedGCLiveThresholdPercent=90',
        '-XX:G1RSetUpdatingPauseTimePercent=0',
        '-XX:SurvivorRatio=32',
        '-XX:MaxTenuringThreshold=1',
        '-XX:G1SATBBufferEnqueueingThresholdPercent=30',
        '-XX:G1ConcMarkStepDurationMillis=5',
        '-XX:G1ConcRSHotCardLimit=16',
        '-XX:G1ConcRefinementServiceIntervalMillis=150',
      ];
    },
  } as FlagOption,
  benchmarkedZGC: {
    generate: () => {
      return [...baseBenchmarked, '-XX:+UseZGC', '-XX:AllocatePrefetchStyle=1', '-XX:-ZProactive'];
    },
  } as FlagOption,
  benchmarkedShenandoah: {
    generate: () => {
      return [
        ...baseBenchmarked,
        '-XX:+UseShenandoahGC',
        '-XX:ShenandoahGCMode=iu',
        '-XX:ShenandoahGuaranteedGCInterval=1000000',
        '-XX:AllocatePrefetchStyle=1',
      ];
    },
  } as FlagOption,
  etils: {
    generate: ({ memory }) => {
      return [
        ...baseEtil,
        ...(memory < 12
          ? [
              '-XX:G1NewSizePercent=30',
              '-XX:G1MaxNewSizePercent=40',
              '-XX:G1HeapRegionSize=8M',
              '-XX:G1ReservePercent=20',
              '-XX:InitiatingHeapOccupancyPercent=15',
            ]
          : [
              '-XX:G1NewSizePercent=40',
              '-XX:G1MaxNewSizePercent=50',
              '-XX:G1HeapRegionSize=16M',
              '-XX:G1ReservePercent=15',
              '-XX:InitiatingHeapOccupancyPercent=20',
            ]),
      ];
    },
  } as FlagOption,
  proxy: {
    generate: () => {
      return [
        '-XX:+UseG1GC',
        '-XX:G1HeapRegionSize=4M',
        '-XX:+UnlockExperimentalVMOptions',
        '-XX:+ParallelRefProcEnabled',
        '-XX:+AlwaysPreTouch',
        '-XX:MaxInlineLevel=15',
      ];
    },
  } as FlagOption,
  none: {
    generate: () => {
      return [];
    },
  } as FlagOption,
};

export const extraFlags: Record<ExtraFlagType, FlagExtraOption> = {
  vectors: {
    label: 'Modern Vectors',
    description: 'Enables SIMD operations to optimize map item rendering on Pufferfish and its forks.',
    supports: ['aikars', 'meowice', 'benchmarkedG1GC'],
    generate: ({ existingFlags }) => [...existingFlags, '--add-modules=jdk.incubator.vector'],
  },
  benchmarkedGraalVM: {
    label: 'Benchmarked (GraalVM)',
    description: 'Additional performance flags for Benchmarked (G1GC) exclusive to GraalVM users.',
    supports: ['benchmarkedG1GC'],
    generate: ({ existingFlags }) => [
      ...existingFlags,
      '-XX:+UnlockExperimentalVMOptions',
      '-XX:+UnlockDiagnosticVMOptions',
      '-XX:+AlwaysActAsServerClassMachine',
      '-XX:+AlwaysPreTouch',
      '-XX:+DisableExplicitGC',
      '-XX:+UseNUMA',
      '-XX:AllocatePrefetchStyle=3',
      '-XX:NmethodSweepActivity=1',
      '-XX:ReservedCodeCacheSize=400M',
      '-XX:NonNMethodCodeHeapSize=12M',
      '-XX:ProfiledCodeHeapSize=194M',
      '-XX:NonProfiledCodeHeapSize=194M',
      '-XX:-DontCompileHugeMethods',
      '-XX:+PerfDisableSharedMem',
      '-XX:+UseFastUnorderedTimeStamps',
      '-XX:+UseCriticalJavaThreadPriority',
      '-XX:+EagerJVMCI',
      '-Dgraal.TuneInlinerExploration=1',
      '-Dgraal.CompilerConfiguration=enterprise',
    ],
  },
  meowiceGraalVM: {
    label: "MeowIce's Flags (GraalVM)",
    description: "Additional performance flags for MeowIce's Flags exclusive to GraalVM users.",
    supports: ['meowice'],
    generate: ({ existingFlags }) => [
      ...existingFlags,
      '-Djdk.nio.maxCachedBufferSize=262144',
      '-Dgraal.UsePriorityInlining=true',
      '-Dgraal.Vectorization=true',
      '-Dgraal.OptDuplication=true',
      '-Dgraal.DetectInvertedLoopsAsCounted=true',
      '-Dgraal.LoopInversion=true',
      '-Dgraal.VectorizeHashes=true',
      '-Dgraal.EnterprisePartialUnroll=true',
      '-Dgraal.VectorizeSIMD=true',
      '-Dgraal.StripMineNonCountedLoops=true',
      '-Dgraal.SpeculativeGuardMovement=true',
      '-Dgraal.TuneInlinerExploration=1',
      '-Dgraal.LoopRotation=true',
      '-Dgraal.OptWriteMotion=true',
      '-Dgraal.CompilerConfiguration=enterprise',
    ],
  },
};
