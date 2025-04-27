import { AvailableConfig } from "../../config"
import { GenerateOperatingSystem } from "../generate/GenerateOperatingSystem"
import { EnvironmentOption } from "./EnvironmentOption"

interface File {
    'name'?: string,
    'mime': string,
    'extension': string
}

export interface OperatingSystemOption extends EnvironmentOption {
    'file': File | false,
    'generate': GenerateOperatingSystem<AvailableConfig | 'existingFlags'>
}
