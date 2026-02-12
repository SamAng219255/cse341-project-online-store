/* ***********************
 * Require Statements
 *************************/
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;

const app = express();

const apiRoutes = require("./routes");
const swaggerRoute = require("./routes/swagger");
const authRoutes = require("./routes/auth");

/* ***********************
 * Middleware
 *************************/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

app.use(session({
  secret: process.env.SESSION_SECRET || "superSecret123",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

/* ***********************
 * Passport GitHub OAuth
 *************************/
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.GITHUB_CALLBACK_URL
}, (accessToken, refreshToken, profile, done) => {
  return done(null, profile);
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

/* ***********************
 * Routes
 *************************/
app.use("/auth", authRoutes);
app.use(apiRoutes);
app.use(swaggerRoute);

app.get("/", (req, res) => {
  if (req.user) {
    res.json({ message: "Logged in", user: req.user.username });
  } else {
    res.json({ message: "Not logged in" });
  }
});

app.use((req, res) => {
  res.status(404).json({ message: "Unknown endpoint." });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
