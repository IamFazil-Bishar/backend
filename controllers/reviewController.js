import Tour from "../models/Tour.js"
import Review from "../models/Review.js"

import jwt from 'jsonwebtoken';
import { verifyToken } from '../utils/verifyToken.js'; // Assuming `verifyToken` middleware is defined in auth.js

export const createReview = async (req, res) => {
    try {
        // Obtain the authorization token from the request headers
        const token = req.headers.authorization;
        
        // Verify the authorization token
        jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decodedToken) => {
            if (err) {
                return res.status(401).json({ success: false, message: 'Unauthorized' });
            }

            // Token is valid, proceed with review creation
            const tourId = req.params.tourId;
            const newReview = new Review({ ...req.body });

            try {
                const savedReview = await newReview.save();
                
                // Update the reviews array of the tour
                await Tour.findByIdAndUpdate(tourId, {
                    $push: { reviews: savedReview._id }
                });

                res.status(200).json({ success: true, message: 'Review submitted', data: savedReview });
            } catch (error) {
                res.status(500).json({ success: false, message: 'Failed to submit review' });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};