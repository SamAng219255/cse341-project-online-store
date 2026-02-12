const requireAuth = (req, res, next) => {
  if (!req.isAuthenticated())
    return res.status(401).json({ message: "Not authenticated" });
  next();
};

module.exports = { requireAuth };
