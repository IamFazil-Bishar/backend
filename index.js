// Import necessary modules
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";

// Import routes
import tourRoute from './routes/tours.js' 
import userRoute from './routes/users.js' 
import authRoute from './routes/auth.js' 
import reviewRoute from './routes/review.js' 
import bookingRoute from './routes/booking.js' 

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Define port
const port = process.env.PORT || 8000;

// Configure CORS options
const corsOptions = {
  origin: 'https://frontend-iota-ochre-57.vercel.app',
  credentials: true // Allow credentials to be sent
}

// Enable CORS middleware
app.use(cors(corsOptions));

// Enable cookie parsing middleware
app.use(cookieParser());

// Middleware to handle JSON requests
app.use(express.json());

// Database connection
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

// Middleware to handle CORS preflight requests
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://frontend-iota-ochre-57.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true'); // Allow credentials to be sent
  if (req.method === 'OPTIONS') {
    // Preflight request
    res.sendStatus(200);
  } else {
    next();
  }
});

// Mount routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/tours", tourRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/review", reviewRoute);
app.use("/api/v1/booking", bookingRoute);

// Start the server
app.listen(port, () => {
  connect();
  console.log("Server listening on port", port);
});
