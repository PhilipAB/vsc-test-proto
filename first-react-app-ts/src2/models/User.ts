export interface User {
    id: number,
    providerId: number,
    name: string,
    role: "Student" | "Lecturer"
}