export interface MyCourse {
    courseId: number,
    name: string,
    hidden: boolean,
    starred: boolean
    role: "CourseAdmin" | "Teacher" | "Student"
}