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
                address: "",
                accountType: "customer",
            };
            const id = await userModel.createUser(newUser);
            user = { ...newUser, id };
        }
        else {
            user.id = user._id.toString();
        }
        return done(null, user);
    } catch (error) {
        return done(error, false);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (user, done) => {
    try {
        const user = await usersModel.getSingleUser(userId);

        user.id = user._id.toString();

        done(null, user);
    }
    catch(err) {
        console.error(`deserializeUser: ${err.name}: ${err.message}`);
        done(null, null);
    }
});

module.exports = passport;