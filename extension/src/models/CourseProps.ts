export interface CourseProps {
    id: number,
    name: string,
    role: "Student" | "Teacher" | "CourseAdmin" | ""
}