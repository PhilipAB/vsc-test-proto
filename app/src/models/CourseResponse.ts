export interface CourseResponse {
    id: number,
    name: string,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    creator_id: number
    // CourseResponse is indexable to allow changing instances from snake_case to camelCase
    [key: string]: string | number
}