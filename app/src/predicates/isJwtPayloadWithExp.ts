import { JwtPayloadWithExp } from "../models/JwtPayloadWithExp";

export function isJwtPayloadWithExp(payload: null | { [key: string]: any } | string): payload is JwtPayloadWithExp {
    return (
        payload ? 
        payload.hasOwnProperty('userId') &&
        payload.hasOwnProperty('iat') &&
        payload.hasOwnProperty('exp')
        : false
    );
}