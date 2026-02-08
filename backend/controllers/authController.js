import genToken from "../config/token.js";
import User from "../models/Users.js";
import bcrypt from "bcryptjs";

export const signUp = async(req, res) => {
  try {
    const {userName, email, password} = req.body;
    
    const checkusername = await User.findOne({userName});
    if (checkusername) {
      return res.status(400).json({
        message: "Username already exists",
      })
    }
    
    const checkemail = await User.findOne({email});
    if (checkemail) {
      return res.status(400).json({
        message: "Email already exists",
      })
    }
    
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters"
      })
    }
    
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      userName, email, password: hashPassword
    })
    
    const token = await genToken(user._id);
    
    return res.status(201).json({
      user,
      token  
    })
    
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({
      message: `Signup error: ${error.message}`
    })
  }
}

export const login = async(req, res) => {
  try {
    const {email, password} = req.body;
    
    const user = await User.findOne({email});
    if (!user) {
      return res.status(400).json({
        message: "User doesn't exist"
      })
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Password incorrect"
      })
    }
    
    const token = await genToken(user._id);
    
    return res.status(201).json({
      user,
      token 
    })
    
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      message: `Login error: ${error.message}`
    })
  }
}

export const logout = async(req, res) => {
  try {
    return res.status(200).json({
      message: "User logged out"
    })
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      message: `Error in logout: ${error.message}`
    })
  }
}