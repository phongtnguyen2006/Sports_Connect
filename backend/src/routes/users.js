import { Router } from 'express';
import { getSupabase, getSupabaseAdmin, isSupabaseConfigured } from '../config/supabase.js';
import multer from 'multer';

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
  const favorite_sports = JSON.parse(req.body.favoriteSports || "[]");
  //const profileResult = await supabase

  let profileImageUrl = null;

  // If user uploaded a profile image, store it in Supabase Storage
  if (req.file) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({
        error: "Invalid file type. Please upload a JPEG, PNG, or WebP image."
      });
    }

  const fileExtension = req.file.originalname.split('.').pop();

  // File path that is uploaded to Supabase Storage, using user ID and timestamp to ensure uniqueness
  // Exmple: "userId/profile-123456789.jpg"
  const filePath = `${userId}/profile-${Date.now()}.${fileExtension}`;

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
