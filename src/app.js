// // import cors from "cors";
// // import path from "path";
// // import express from "express";
// // import sequenceRouter from "./routes/sequence.route.js";

// // import cookieParser from "cookie-parser";
// // import authRouter from "./routes/auth.route.js";

// // const app = express();
// // app.use(express.json());

// // // Middleware to enable CORS for the frontend
// // app.use(
// //   cors({
// //     origin: "http://localhost:5173", // Make sure the URL is without the trailing slash
// //     credentials: true,
// //   })
// // );

// // app.use(cookieParser());
// // app.use("/api/auth", authRouter);

// // // Enable trust proxy for handling proxy headers
// // app.set("trust proxy", 1);

// // // Serve static files from the 'public' directory
// // app.use(express.static("public"));

// // // Allow only a specific content size limit for incoming requests
// // app.use(express.json({ limit: "16kb" }));

// // // Use the sequence router for all API requests under '/api/sequence'
// // app.use("/api/sequence", sequenceRouter);

// // // Resolve the __dirname for serving frontend static files
// // const __dirname = path.resolve();

// // // Serve the React build files
// // app.use(express.static(path.join(__dirname, "../frontend/dist")));

// // // Catch-all route to serve the React app for any unmatched routes
// // app.get("*", (req, res) => {
// //   res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
// // });

// // export { app };

// import cors from "cors";
// import path from "path";
// import express from "express";
// import cookieParser from "cookie-parser";
// import authRouter from "./routes/auth.route.js";
// import sequenceRouter from "./routes/sequence.route.js";

// const app = express();
// app.use(express.json());

// // Middleware to enable CORS for the frontend
// app.use(
//   cors({
//     origin: "http://localhost:5173", // Ensure this matches your frontend URL
//     credentials: true, // This is important for cookie-based authentication
//   })
// );

// app.use(cookieParser());
// app.use("/api/auth", authRouter);

// // Serve static files from the 'public' directory
// app.use(express.static("public"));

// // API route for /api/sequence
// app.use("/api/sequence", sequenceRouter);

// // Set up trust proxy (this is used for when your app is behind a proxy or load balancer)
// app.set("trust proxy", 1);

// // Serve frontend static files from the build directory
// const __dirname = path.resolve();
// app.use(express.static(path.join(__dirname, "../frontend/dist")));

// // Catch-all route to serve React frontend for all other routes
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
// });

// export { app };
import express from "express";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.route.js";
import sequenceRouter from "./routes/sequence.route.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Failed to connect to MongoDB", err));

app.use(express.json());
app.use(cookieParser());

// CORS configuration
app.use(
  cors({
    origin: "https://email-schedular-frontend.vercel.app", // Make sure the URL is without the trailing slash
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRouter);
app.use("/api/sequence", sequenceRouter);

// Set up trust proxy for secure cookies
app.set("trust proxy", 1);

// Serve static files from frontend build
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// Fallback route for React
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

export { app };

