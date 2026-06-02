
export function datetimeLocalToTimestamptz(value) {
    if (!value) return null; 

    const date = new Date(value); 
    if (Number.isNaN(date.getTime())) {
        throw new Error("Invalid datetime value"); 
    }
    return date.toISOString(); 
}