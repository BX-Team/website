import { AvailableServerType } from "../../environment/serverType"
import { AvailableExtraFlags } from "../../flags"
import { AvailableFlags } from "../../flags"
import { Generate } from "../generate/Generate"
import { EnvironmentOption } from "./EnvironmentOption"

export interface ServerTypeOption extends EnvironmentOption {
    'flags': AvailableFlags[],
    'extraFlags'?: AvailableExtraFlags[],
    'default': {
        'flags': AvailableFlags,
        'extraFlags'?: AvailableExtraFlags[]
    },
    'generate'?: Generate<AvailableServerType | 'existingFlags'>
}
