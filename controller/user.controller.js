import User from "../models/user.model.js";
import transporter from "../utilites/email.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const registerController = async (req, res) => {
    try {
        const { email,name,pass,phone,add } = req.body;
      if(!email || !name || !pass || !phone || !add){
          return res.status(400).json({message:"All fields are required",success:false})
      }
      const existingUser = await User.findOne({ email });   
        if (existingUser) {
            return res.status(400).json({message:"User already exists",success:false})
        }

    const hashedPassword = await bcrypt.hash(pass, 12);

    const newUser = new User({email,name,pass:hashedPassword,phone,add});
  
      // Save the user to the database
      await newUser.save();
  
      // Generate OTP (random 6-digit number)
      const otp = Math.floor(100000 + Math.random() * 900000);

      newUser.otp = otp;

        await newUser.save();
  
      // Send OTP to user's email
      const mailOptions = {
        from: "rawoolaniruddha3@gmail.com",
        to: newUser.email,
        subject: "Verification OTP",
        text: `Your OTP for registration is: ${otp}`,
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("Error sending email: ", error);
          res.status(500).send("Error sending OTP.");
        } else {
          console.log("Email sent: " + info.response);
            res.status(200).send("OTP sent successfully.");
        }
      });
    } catch (error) {
      console.error("Registration failed: ", error);
      return res.status(500).send("Registration failed.");
    }
  };

  const verifyOTPController = async (req, res) => {
    try {
      const { email, otp } = req.body;
  
      // Find user by email
      const user = await User.findOne({ email });
  
      // Check if user exists and OTP matches
      if (user && user.otp === otp) {
        // Update user verification status
        user.isVerified = true;
        await user.save();
        res.status(200).send("OTP verified successfully.");
      } else {
        res.status(400).send("Invalid OTP.");
      }
    } catch (error) {
      console.error("OTP verification failed: ", error);
      return res.status(500).send("OTP verification failed.");
    }
  };

  const loginController = async (req, res) => {
    try {
      const { email, pass } = req.body;
  
      // Find user by email
      const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({message:"User does not exist",success:false})
        }

        // Check if user is verified
        if (!user.isVerified) {
            return res.status(400).json({message:"User is not verified",success:false})
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(pass, user.pass);
        if (!isMatch) {
            return res.status(400).json({message:"Invalid credentials",success:false})
        }

        const token = await jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"5h"});


        return res.status(200).json({message:"Login successful",success:true,token})
    }
    catch (error) {
        console.error("Login failed: ", error);
        return res.status(500).send("Login failed.");
    }
  }

  const profileController = async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select("-pass");
        res.status(200).send({success:true,user});
    }
    catch (error) {
        console.error("Profile failed: ", error);
        return res.status(500).send("Profile failed.");
    }
  }
  export { registerController, verifyOTPController,loginController,profileController }