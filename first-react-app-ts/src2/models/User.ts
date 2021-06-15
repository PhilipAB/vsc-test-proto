export interface User {
    id: number,
    name: string,
    role: "Student" | "Lecturer"
}

export interface UserCourseRole {
    id: number,
    name: string,
    role: "Student" | "Teacher" | "CourseAdmin"
}