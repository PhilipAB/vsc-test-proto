export interface SimpleCourse {
    id: number
    name: string
}

export interface Course extends SimpleCourse {
    creatorId: number
    description: string
}