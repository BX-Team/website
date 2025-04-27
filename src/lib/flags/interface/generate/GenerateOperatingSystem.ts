import { Generate } from "./Generate";

export interface GenerateOperatingSystemResult {
    'script': string,
    'flags': string[]
}

export type GenerateOperatingSystem<T extends string | number> = Generate<T, GenerateOperatingSystemResult>;
