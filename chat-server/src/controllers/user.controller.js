import { User } from "../models/user.model.js";

const registerUser = async (req,res)=>{
  
 try{
    const { name, email, password } = req.body;

    console.log("Register body ",req.body);

    // Validate input data
      if (!name || !email || !password) {
          return res.status(400).json({ message: "Name, email, and password are required." });
      }

   // Check if user already exists
   const existingUser = await User.findOne({ email });
   if (existingUser) {
     return res.status(400).json({ message: "User already exists" });
   }
   
   // Create new user and save
  const newUser = new User({ name, email, password });
  await newUser.save().then((response)=>{
     res.status(200).json(response);
  });
 }catch(e){
    console.log("Error registering user ",e);
    
 }
}

const logInUser = async (req,res)=>{
 try{

   const {email, password} = req.body;
   
   // Validate input data
if (!email || !password) {
  return res.status(400).json({ message: "Email, and password are required." });
}
 // Check if user exists
const existingUser = await User.findOne({ email });
if (!existingUser) {
  return res.status(400).json({message: "User does not exist" });
}

// Verify password
const isPasswordCorrect = await existingUser.isPasswordCorrect(password);
if (!isPasswordCorrect) {
  return res.status(401).json({ message: "Invalid password" });
}

res.status(200).json(existingUser); 
 }catch(e){
    console.log("Error in login user",e);
 }
}

const getAllUsers = async (req, res) => {
  try {
    console.log("Getting users all");
      // Retrieve all users from the database except their password field
      const users = await User.find({}).select('-password'); 
      res.status(200).json(users); 
  } catch (e) {
      console.error("Error fetching users: ", e);
      res.status(500).json({ message: "Internal server error" });
  }
};

export   {registerUser,logInUser,getAllUsers};