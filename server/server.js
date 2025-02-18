import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cron from "node-cron";
import fs from "fs/promises";
import path from "path";
import nodemailer from "nodemailer";
import { Parser } from "json2csv";
import { fileURLToPath } from "url";

import authRoutes from "./route/authRoutes.js";
import userRoutes from "./route/userRoutes.js";
import uploadRoutes from "./route/uploadRoutes.js";
import { User } from "./model/userModel.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.log("Database connection error:", error));

// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to fetch users and send as CSV
const runMonthlyTask = async () => {
  try {
    const users = await User.find({});
    if (users.length === 0) {
      console.log("No users found.");
      return;
    }

    // Convert users data to CSV format
    const fields = ["_id", "name", "email", "createdAt"];
    const json2csvParser = new Parser({ fields });
    const csvData = json2csvParser.parse(users);

    // Define file path
    const filePath = path.join(__dirname, "users.csv");

    // Write CSV file
    await fs.writeFile(filePath, csvData);

    // Send Email with CSV attachment
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "saccout64@gmail.com",
      subject: "Monthly User Data Report",
      text: "Attached is the CSV report of all users.",
      attachments: [{ filename: "users.csv", path: filePath }],
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully with CSV attachment.");

    // Delete temporary file after sending email
    await fs.unlink(filePath);
  } catch (error) {
    console.error("Error fetching users or sending email:", error);
  }
};

// Schedule the task to run at 00:00 on the 1st of every month
cron.schedule(
  "0 0 19 * *",
  () => {
    runMonthlyTask();
  },
  {
    scheduled: true,
    timezone: "Asia/Kolkata",
  }
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api", uploadRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
