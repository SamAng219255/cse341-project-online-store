const express = require("express");
const router = express.Router();
const passport = require("passport");

//Route to sign in with github
router.get('/login', passport.authenticate('github', { scope: ['user:email'] }));

//Route to handle the callback from github
router.get('/github/callback', passport.authenticate('github', {
    failureRedirect: '/login'
}), (req, res) => {
    res.redirect('/');
});

//Route to logout
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ message: "Error logging out" });
        }
        res.redirect('/');
    });
});

module.exports = router;