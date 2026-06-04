import { getAuthHeaders } from "../../utils/getAuthHeaders";

export async function fetchEventComments(event) {
    const response = await fetch(`/api/events/${event.id}/comment`, {
        headers: getAuthHeaders(),
    });

    if(!response.ok) {
        throw new Error('Failed to fetch comments'); 
    }

    const data = await response.json(); 
    return data.comments;
}

export async function createEventComment(event, message) {
    //Posts a new comment to db by calling the backend api
    const response = await fetch(`/api/events/${event.id}/comment`, {
        method: 'POST',
        headers: getAuthHeaders(true), 
        body: JSON.stringify({message})
    });

    if (!response.ok) {
        throw new Error('Failed to create an event'); 
    }
    const data = await response.json(); 
    return data.comment ?? [];
}
