import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import tourRoute from './routes/tours.js' 
import userRoute from './routes/users.js' 
import authRoute from './routes/auth.js' 
import reviewRoute from './routes/review.js' 
import bookingRoute from './routes/booking.js' 

dotenv.config();
const app = express();
const port = process.env.PORT || 8000;

// Set up middleware for JSON parsing and cookie parsing
app.use(express.json());
app.use(cookieParser());

// Manually set CORS headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "https://frontend-iota-ochre-57.vercel.app/");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

// Connect to MongoDB
mongoose.set("strictQuery", false);
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB database Connected");
  } catch (err) {
    console.log("MongoDB database Connection failed", err);
  }
};

// Routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/tours", tourRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/review", reviewRoute);
app.use("/api/v1/booking", bookingRoute);

// Start server
app.listen(port, () => {
  connect();
  console.log("Server listening on port", port);
});
