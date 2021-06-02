import { Course } from "../models/Course";

export function isNonEmptyCourseArray(data: any[]): data is Course[] {
    return (
        // check if array is not empty to verify data[0] exists
        data.length > 0 &&
        // check if data[0] defines course properties
        data[0].hasOwnProperty('id') &&
        data[0].hasOwnProperty('name') &&
        data[0].hasOwnProperty('creatorId')
        // -> return type is Course[] 
    );
}