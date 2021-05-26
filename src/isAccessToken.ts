export function isAccessToken(data: { accessToken: string } | { error: string }): data is { accessToken: string } {
    return (data.hasOwnProperty('accessToken'));
}