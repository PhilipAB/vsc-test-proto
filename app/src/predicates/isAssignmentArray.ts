import { Assignment } from "../models/Assignment";

export function isNonEmptyAssignmentArray(data: any[]): data is Assignment[] {
    return (
        // check if array is not empty to verify data[0] exists
        data.length > 0 &&
        // check if data[0] defines assignment properties
        data[0].hasOwnProperty('id') &&
        data[0].hasOwnProperty('name') &&
        data[0].hasOwnProperty('repository') &&
        data[0].hasOwnProperty('description')
        // -> return type is Assignment[] 
    );
}