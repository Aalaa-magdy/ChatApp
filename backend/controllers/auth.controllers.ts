import type { Request, Response } from "express"

import User from "../models/user.ts";
import bcrypt from "bcryptjs";
import user from "../models/user.ts";
import { generateToken } from "../utils/token.ts";

export const registerUser = async(req:Request , res:Response):Promise<void>=>{
        const {email, password, name, avatar} = req.body;
        try{
          let user = await User.findOne({email});
          if(user){
            res.status(400).json({sucess:false , message: "User already exists"});
            return;
          }
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(password, salt);
          user = new User({ email, password: hashedPassword, name, avatar: avatar || "" });
          await user.save();
          const token = generateToken(user);
          res.status(201).json({ message: "User registered successfully", token });
        }
          
      
       
        catch(error){
            console.error("Error registering user", error);
            res.status(500).json({message: "Internal server error"});
        }
       

}

export const loginUser = async(req:Request , res:Response):Promise<void>=>{
    const {email, password} = req.body;
    try{
      const user = await User.findOne({email});
      if(!user){
        res.status(400).json({sucess:false , message: "User not found"});
        return;
      }
      // compare the password
      const isMatch = await bcrypt.compare(password, user.password);
      if(!isMatch){
        res.status(400).json({sucess:false , message: "Invalid password"});
        return;
      }
      const token = generateToken(user);
      res.json({ token });
    }
    catch(error){
        console.error("Error registering user", error);
        res.status(500).json({message: "Internal server error"});
    }
   

}