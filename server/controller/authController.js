import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { User, ROLES } from "../model/userModel.js";

const SECRET_KEY = process.env.JWT_SECRET || "saumic";

// Signup for admin
export const signupAdmin = async (req, res) => {
  try {
    const { uid, name, email, password } = req.body;

    const existingAdmin = await User.findOne({ role: ROLES.ADMIN });
    if (existingAdmin) {
      return res.status(403).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await User.create({
      uid,
      name,
      email,
      password: hashedPassword,
      role: ROLES.ADMIN,
    });

    res.status(201).json({ message: "Admin created successfully", admin });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating admin", error: error.message });
  }
};

// Signin

// export const signin = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).json({ message: 'User not found' });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

//     const token = jwt.sign({ id: user._id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });

//     res.status(200).json({ token });
//   } catch (error) {
//     res.status(500).json({ message: 'Error during signin', error: error.message });
//   }
// };

// export const signin = async (req, res) => {
//   try {
//     const { email, name, uid, password } = req.body;

//     let user;
//     let isMatch = false;

//     if (email) {
//       // Admin Signin
//       user = await User.findOne({ email, role: ROLES.ADMIN });
//       if (!user) return res.status(404).json({ message: 'Admin not found' });

//       isMatch = await bcrypt.compare(password, user.password);
//       if (!isMatch) return res.status(401).json({ message: 'Invalid credentials for admin' });
//     } else if (name) {
//       // Manager Signin
//       user = await User.findOne({ name, role: ROLES.MANAGER });
//       if (!user) return res.status(404).json({ message: 'Manager not found' });

//       isMatch = password === user.password; // Plaintext comparison
//       if (!isMatch) return res.status(401).json({ message: 'Invalid credentials for manager' });
//     } else if (uid) {
//       // User Signin
//       user = await User.findOne({ uid, role: ROLES.USER });
//       if (!user) return res.status(404).json({ message: 'User not found' });

//       isMatch = password === user.password; // Plaintext comparison
//       if (!isMatch) return res.status(401).json({ message: 'Invalid credentials for user' });
//     } else {
//       return res.status(400).json({ message: 'Invalid login parameters' });
//     }

//     // Generate JWT
//     const token = jwt.sign({ id: user._id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });

//     res.status(200).json({ token, role: user.role, message: 'Signin successful' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error during signin', error: error.message });
//   }
// };

dotenv.config();

const otpStore = new Map(); // Temporary in-memory OTP storage

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const signin = async (req, res) => {
  try {
    const { uid, password } = req.body;
    console.log(uid, password);

    if (!uid || !password) {
      return res.status(400).json({ message: "UID and password are required" });
    }

    const user = await User.findOne({ uid });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // OTP valid for 5 minutes

    otpStore.set(uid, { otp, expiresAt });

    setTimeout(() => otpStore.delete(uid), 5 * 60 * 1000);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "mdfaizahmad1020@gmail.com",
      subject: "Your OTP for Login",
      text: `Your OTP is: ${otp}. It is valid for 5 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: "OTP sent to your email",
      uid: user.uid,
      role: user.role,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error during signin", error: error.message });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { uid, otp } = req.body;

    if (!otpStore.has(uid)) {
      return res.status(400).json({ message: "OTP expired or not found" });
    }

    const storedOtp = otpStore.get(uid);

    if (String(storedOtp.otp) !== String(otp)) {
      return res.status(401).json({ message: "Invalid OTP" });
    }

    if (Date.now() > storedOtp.expiresAt) {
      otpStore.delete(uid);
      return res.status(400).json({ message: "OTP expired" });
    }

    otpStore.delete(uid);

    const user = await User.findOne({ uid });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, SECRET_KEY, {
      expiresIn: "1h",
    });

    res
      .status(200)
      .json({ token, role: user.role, message: "OTP verified successfully!" });
  } catch (error) {
    console.error("Error verifying OTP:", error.message);
    res
      .status(500)
      .json({ message: "Error verifying OTP", error: error.message });
  }
};

// Create role (static roles, admin-only)
export const createRole = async (req, res) => {
  res.status(405).json({
    message: "Dynamic role creation is not supported in this implementation.",
  });
};
