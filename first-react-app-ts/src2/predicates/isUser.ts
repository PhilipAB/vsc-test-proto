import { User } from "../models/User";

export function isUser(data?: User): data is User {
    return (
        data ?
            data.hasOwnProperty('id') &&
            data.hasOwnProperty('providerId') &&
            data.hasOwnProperty('name') &&
            data.hasOwnProperty('role')
            : false
    );
}