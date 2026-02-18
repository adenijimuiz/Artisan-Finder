import express from "express"
import { createReview, getArtisanReviews } from "../controllers/reviewController.js";
import { protect } from "../middleware/auth.js";


const reviewRouter = express.Router();

reviewRouter.post('/', protect, createReview);
reviewRouter.get('/artisan/:artisanId', getArtisanReviews);

export default reviewRouter;