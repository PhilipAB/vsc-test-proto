export function snakeToCamelCase(data: any[]): any[] {
    data.map(course => {
        Object.keys(course).map(oldKey => {
            if (oldKey.match(/[_][a-z]/)) {
                const newKey: string = oldKey.replace(/[_][a-z]/g, (group) => group.slice(-1).toUpperCase());
                delete Object.assign(course, { [newKey]: course[oldKey] })[oldKey];
            }
        });
    });
    return data;
}