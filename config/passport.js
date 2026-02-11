const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const userModel = require('../models/users');

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await userModel.getSingleUserbyGithubId(profile.id);
        if (!user) {
            const newUser = {
                firstName: profile.displayName || "",
                lastName: "",
                email: profile.email || "",
                oauth: {
                    provider: "github",
                    githubId: profile.id
                },
                accountType: "customer",
            };
            const id = await userModel.createUser(newUser);
            user = { ...newUser, id };
        }
        return done(null, user);
    } catch (error) {
        return done(error, false);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

module.exports = passport;