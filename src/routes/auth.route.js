import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const router = Router();

// Signup route
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).send("User already exists");

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).send("User registered successfully!");
  } catch (error) {
    res.status(500).send("Error signing up");
  }
});

// Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).send("Invalid credentials");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).send("Invalid credentials");

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.cookie("token", token, { httpOnly: true, secure: false }) // In production set secure to true
      .status(200)
      .send("Login successful");
  } catch (error) {
    res.status(500).send("Error logging in");
  }
});

// Logout route
router.post("/logout", (req, res) => {
  res.clearCookie("token").send("Logged out successfully");
});

// Status route to check authentication
router.get("/status", (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).send("Not authenticated");

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).send("Authenticated");
  } catch (error) {
    res.status(401).send("Not authenticated");
  }
});

export default router;
