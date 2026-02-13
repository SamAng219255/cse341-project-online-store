const express = require("express");
const router = express.Router();
const reviewsController = require("../controllers/reviews");
const reqAuthorize = require("../middleware/reqAuthorize");

router.get(
	"/",
	reviewsController.getAllReviews
);

router.post(
	"/",
	reqAuthorize(),
	reviewsController.createReview
);

router.get(
	"/:reviewId",
	reviewsController.getReviewById
);

router.put(
	"/:userId/:reviewId",
	reqAuthorize({idMatchesParam: "userId"}),
	reviewsController.updateReview
);

router.delete(
	"/:userId/:reviewId",
	reqAuthorize({idMatchesParam: "userId"}),
	reviewsController.deleteReview
);

module.exports = router;