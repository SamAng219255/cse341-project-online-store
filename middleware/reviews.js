const reviewsModel = require("../models/reviews");

const requireOwnReview = async (req, res, next) => {
  try {
    const reviewId = req.params.reviewId;
    const review = await reviewsModel.getReviewById(reviewId);

    // review.customer is the id of user that created the review
    if (review.customer.toString() !== req.user.id)
      return res.status(403).json({ message: "You can only modify your own review" });

    next();
  } catch (err) {
    return res.status(404).json({ message: "Review not found" });
  }
};

module.exports = { requireOwnReview };
