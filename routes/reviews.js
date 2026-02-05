const express = require("express");
const router = express.Router();
const reviewsController = require("../controllers/reviews");

router.get("/", reviewsController.getAllReviews);

router.post("/", reviewsController.createReview);

router.get("/:reviewId", reviewsController.getReviewById);

router.put("/:reviewId", reviewsController.updateReview);

router.delete("/:reviewId", reviewsController.deleteReview);

module.exports = router;