import { Assignment } from "./Assignment";

export interface AssignmentExtended extends Assignment {
    visibleFrom: string | null,
    visibleTill: string | null
}