import { getSupabase } from '../config/supabase.js'; 

export async function getAuthUser(req, res) {
    const authHeader = req.headers.authorization; 
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
        res.status(401).json({ error: 'Missing auth token' });
        return null;
    }

    const { data, error } = await getSupabase().auth.getUser(token); 

    if (error || !data.user) {
        res.status(401).json({ error: error?.message ?? 'Invalid auth token'});
        return null;
    }

    return data.user; 
}