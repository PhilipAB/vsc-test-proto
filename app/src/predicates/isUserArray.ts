import { UserCourseRole } from "../models/User";

export function isUserArray(data: any): data is UserCourseRole[] {
    return (
        Array.isArray(data) &&
        (data.length === 0 ||
            (data.length > 0 &&
                data[0].hasOwnProperty('id') &&
                data[0].hasOwnProperty('name') &&
                data[0].hasOwnProperty('role'))
        )
    );
}