import { SimpleCourse, Course } from "../models/Course";

export function isSimpleCourseArray(data: any): data is SimpleCourse[] {
    return (
        // check if data is empty array
        (Array.isArray(data) && data.length === 0) ||
        // check if array is not empty to verify data[0] exists
        data.length > 0 &&
        // check if data[0] defines course properties
        data[0].hasOwnProperty('id') &&
        data[0].hasOwnProperty('name')
        // -> return type is SimpleCourse[] 
    );
}

export function isNonEmptyCourseArray(data: any[]): data is Course[] {
    return (
        // check if array is not empty to verify data[0] exists
        data.length > 0 &&
        // check if data[0] defines course properties
        data[0].hasOwnProperty('id') &&
        data[0].hasOwnProperty('name') &&
        data[0].hasOwnProperty('creatorId') &&
        data[0].hasOwnProperty('description')
        // -> return type is Course[] 
    );
}