import { AssignmentExtended } from "../models/AssignmentExtended";

export function isAssignmentExtendedArray(data: any[]): data is AssignmentExtended[] {
    return (
        // check if array is not empty to verify data[0] exists
        data.length > 0 &&
        // check if data[0] defines assignment properties
        data[0].hasOwnProperty('id') &&
        data[0].hasOwnProperty('name') &&
        data[0].hasOwnProperty('repository') &&
        data[0].hasOwnProperty('description') &&
        data[0].hasOwnProperty('visibleFrom') &&
        data[0].hasOwnProperty('visibleTill')
        // -> return type is AssignmentExtended[] 
    );
}