import { CourseProps } from "../models/CourseProps";

export function isCourseProps(value: any): value is CourseProps {
    return (
        value ?
            value.hasOwnProperty('id') &&
            value.hasOwnProperty('name') &&
            value.hasOwnProperty('role')
            : false
    );
}