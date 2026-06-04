import { Router } from 'express';
import { getSupabase, getSupabaseAdmin, isSupabaseConfigured } from '../config/supabase.js';
import { getAuthUser } from '../utils/getAuthUser.js';
import {
  followUser,
  getFollowingForUser,
  getFollowingIds,
  unfollowUser,
} from '../services/followsService.js';
import multer from 'multer';

function escapeIlike(value) {
  return value.replace(/[%_\\]/g, '\\$&');
}

/**
 * Users / profile use case. Mounted at /api/users.
 * Reads from the `profiles` table created in DATABASE_SETUP.txt.
 */
const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
})

// GET /api/users/user-data
router.get('/user-data', async(req,res) => {
  if(!isSupabaseConfigured()){
    return res.status(503)
    .json({error: 'Supabase not configured. See DATABASE_SETUP.txt.'});
  }

  const supabase = getSupabase();

  const authHeader = req.headers.authorization;
  const token = authHeader?.replace("Bearer ", "");

  if(!token){
    return res.status(401).json({error: "Missing auth token"});
  }

  const result = await supabase.auth.getUser(token);

  if(result.error){
    return res.status(401).json({error: result.error.message});
  }

  const userId = result.data.user.id;

  const { data,error } = await supabase
    .from("users")
    .select("*")
    .eq("id",userId)
    .maybeSingle();

  if(error){
    return res.status(500).json({error: error.message});
  }

  if(!data){
    return res.status(404).json({error: "Profile not found"});
  }

  return res.json({user:data});
});

// GET /api/users/search?q=
router.get('/search', async (req, res) => {
  if (!isSupabaseConfigured()) {
    return res
      .status(503)
      .json({ error: 'Supabase not configured. See DATABASE_SETUP.txt.' });
  }

  const user = await getAuthUser(req, res);
  if (!user) return;

  const query = String(req.query.q ?? '').trim();
  if (!query) {
    return res.json({ users: [] });
  }

  try {
    const supabase = getSupabase();
    const pattern = `%${escapeIlike(query)}%`;
    const { data, error } = await supabase
      .from('users')
      .select('id, username, firstName, lastName, profile_image, biography, favorite_sports')
      .or(
        `username.ilike.${pattern},firstName.ilike.${pattern},lastName.ilike.${pattern}`
      )
      .limit(20);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const followingIds = await getFollowingIds(user.id);

    const usersWithFollowStatus = (data ?? [])
      .filter((profile) => profile.id !== user.id)
      .map((profile) => ({
        ...profile,
        is_following: followingIds.has(profile.id),
      }));

    res.json({ users: usersWithFollowStatus });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/users/following
router.get('/following', async (req, res) => {
  if (!isSupabaseConfigured()) {
    return res
      .status(503)
      .json({ error: 'Supabase not configured. See DATABASE_SETUP.txt.' });
  }

  const user = await getAuthUser(req, res);
  if (!user) return;

  try {
    const following = await getFollowingForUser(user.id);
    res.json({ following });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/users/follow
router.post('/follow', async (req, res) => {
  if (!isSupabaseConfigured()) {
    return res
      .status(503)
      .json({ error: 'Supabase not configured. See DATABASE_SETUP.txt.' });
  }

  const user = await getAuthUser(req, res);
  if (!user) return;

  const followingId = String(req.body?.followingId ?? '').trim();
  if (!followingId) {
    return res.status(400).json({ error: 'followingId is required' });
  }

  try {
    await followUser(user.id, followingId);
    res.status(201).json({ message: 'Now following user' });
  } catch (err) {
    const status =
      err.message === 'Already following' || err.message === 'User not found'
        ? 409
        : err.message === 'You cannot follow yourself'
          ? 400
          : 500;
    res.status(status).json({ error: err.message });
  }
});

// DELETE /api/users/follow/:followingId
router.delete('/follow/:followingId', async (req, res) => {
  if (!isSupabaseConfigured()) {
    return res
      .status(503)
      .json({ error: 'Supabase not configured. See DATABASE_SETUP.txt.' });
  }

  const user = await getAuthUser(req, res);
  if (!user) return;

  const followingId = String(req.params.followingId ?? '').trim();
  if (!followingId) {
    return res.status(400).json({ error: 'followingId is required' });
  }

  try {
    await unfollowUser(user.id, followingId);
    res.json({ message: 'Unfollowed user' });
  } catch (err) {
    const status = err.message === 'Follow not found' ? 404 : 500;
    res.status(status).json({ error: err.message });
  }
});

// GET /api/users/:username
router.get('/:username', async (req, res) => {
  if (!isSupabaseConfigured()) {
    return res
      .status(503)
      .json({ error: 'Supabase not configured. See DATABASE_SETUP.txt.' });
  }

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', req.params.username)
    .maybeSingle();

  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: 'Profile not found' });
  res.json({ profile: data });
});




// POST /api/users/register
router.post("/register", async(req,res) => {
  //create/register user
  if (!isSupabaseConfigured()) {
    return res
    .status(503)
    .json({ error: 'Supabase not configured. See DATABASE_SETUP.txt.' });
  }

  const supabase = getSupabase();

  //const{email,password,username,firstName,lastName} = req.body;
  const email = req.body.email;
  const password = req.body.password;


  if(!email || !password){
    return res.status(400).json({
      error:"Email, password are required"
    });
  }

  const {data,error} = await supabase.auth.signUp({
    email,
    password
  });
  //testing
  if (error) {
    return res.status(400).json({
      error: error.message
    });
  }
  if (!data.user) {
    return res.status(400).json({
      error: "Signup did not return a user. The email may already be registered or email confirmation may be affecting signup."
    });

  }
  //console.log("Supabase signup data:", data);
  //console.log("Supabase signup error:", error);

  const profileResult = await supabase
    .from("users")
    .insert({
      id: data.user.id,
      email: data.user.email,
    })


  if(profileResult.error){
    return res.status(500).json({
      error:profileResult.error.message
    });
  }

  return res.status(201).json({
    message:"Signup worked",
    user: data.user,
    session: data.session

  });

});

// POST /api/users/login
router.post("/login", async (req, res) => {
  if (!isSupabaseConfigured()) {
    return res
    .status(503)
    .json({ error: 'Supabase not configured. See DATABASE_SETUP.txt.' });
  }

  const supabase = getSupabase();
  const email = req.body.email;
  const password = req.body.password;

  if(!email || !password){
    return res.status(400).json({
      error:"Email and password are required"
    });
  }

  const {data,error} = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if(error){
    return res.status(401).json({
      error:error.message
    });
  }

  return res.status(200).json({
    message:"Login worked",
    user:data.user,
    session:data.session
  });
});

// PATCH /api/users/register/complete-profile
router.patch('/complete-profile', upload.single('profileImage'), async (req, res) => {

  if (!isSupabaseConfigured()) {
    return res
    .status(503)
    .json({ error: 'Supabase not configured. See DATABASE_SETUP.txt.' });
  }

  const supabase = getSupabase();
  const supabaseAdmin = getSupabaseAdmin();


  const authHeader = req.headers.authorization;
  const token = authHeader?.replace("Bearer ", "");
 
  if(!token){
    return res.status(401).json({error:"Missing auth token"});
  }

  const result = await supabase.auth.getUser(token);
  const data = result.data;
  const error = result.error;

  if(error){
    return res.status(401).json({
      error: error.message
    });
  }

  const userId = data.user.id;

  //const{email,password,username,firstName,lastName} = req.body;
  const username = req.body.username;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const biography = req.body.biography;
  const favorite_sports = JSON.parse(req.body.favoriteSports || "[]");
  //const profileResult = await supabase

  let profileImageUrl = null;

  // If user uploaded a profile image, store it in Supabase Storage
  if (req.file) {
    // Allowed file types for profile images
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    // Validate file type
    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({
        error: "Invalid file type. Please upload a JPEG, PNG, or WebP image."
      });
    }
  
    // Get the file extension from the original filename (e.g., "jpg", "png")
  const fileExtension = req.file.originalname.split('.').pop();

  // File path that is uploaded to Supabase Storage, using user ID and timestamp to ensure uniqueness
  // Exmple: "userId/profile-123456789.jpg"
  const filePath = `${userId}/profile-${Date.now()}.${fileExtension}`;

  // Upload the file buffer to Supabase Storage
  const { error: uploadError } = await supabaseAdmin.storage
    .from("profile-images")
    .upload(filePath, req.file.buffer, {
      contentType: req.file.mimetype,
      upsert: false, // Overwrite existing file if it exists
    });
  
  if (uploadError) {
    return res.status(500).json({
      error: "Failed to upload profile image: " + uploadError.message
    });
  }

  const { data: publicUrlData } = supabaseAdmin.storage
    .from('profile-images')
    .getPublicUrl(filePath); 

  profileImageUrl = publicUrlData.publicUrl;
}

const updateData = {
  firstName: firstName,
  lastName:  lastName,
  username:  username,
  biography: biography,
  favorite_sports:favorite_sports
};

if (profileImageUrl){
  updateData.profile_image = profileImageUrl;
}

  const profileResult = await supabaseAdmin
    .from("users")
    .update(updateData)
    .eq("id",userId);

  if(profileResult.error){
    return res.status(500).json({
      error:profileResult.error.message
    });
  }

  return res.status(200).json({
    message:"Signup worked",
    profile_image: profileImageUrl
  });

});
export default router;
