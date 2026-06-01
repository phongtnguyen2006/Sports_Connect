import { Router } from 'express';
import { getSupabase, isSupabaseConfigured } from '../config/supabase.js';

/**
 * Users / profile use case. Mounted at /api/users.
 * Reads from the `profiles` table created in DATABASE_SETUP.txt.
 */
const router = Router();

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

// GET /api/users/register
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

// Patch /api/users/register/complete-profile
router.patch('/complete-profile', async (req, res) => {

  if (!isSupabaseConfigured()) {
    return res
    .status(503)
    .json({ error: 'Supabase not configured. See DATABASE_SETUP.txt.' });
  }

  const supabase = getSupabase();
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
      error: result.error.message
    });
  }

  const userId = data.user.id;

  //const{email,password,username,firstName,lastName} = req.body;
  const username = req.body.username;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const favorite_sports = req.body.favoriteSports;

  const profileResult = await supabase
  .from("users")
  .update({
    firstName: firstName,
    lastName:  lastName,
    username:  username,
    favorite_sports:favorite_sports
  })
  .eq("id",userId);

  if(profileResult.error){
    return res.status(500).json({
      error:profileResult.error.message
    });
  }

  return res.status(200).json({
    message:"Signup worked"
  })


});



export default router;

