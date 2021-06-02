import { MyCourse } from "../models/MyCourse";

export function isMyCourseArray(data: any[]): data is MyCourse[] {
    return (
        // check if array is not empty to verify data[0] exists
        data.length > 0 &&
        // check if data[0] defines course properties
        data[0].hasOwnProperty('courseId') &&
        data[0].hasOwnProperty('name') &&
        data[0].hasOwnProperty('hidden') &&
        data[0].hasOwnProperty('starred') &&
        data[0].hasOwnProperty('role')
        // -> return type is Course[] 
    );
}