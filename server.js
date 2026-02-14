/* ***********************
 * Require Statements
 *************************/
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const passport = require("passport");
const session = require("express-session");

const app = express();

const apiRoutes = require("./routes");
const swaggerRoute = require("./routes/swagger");
require("./config/passport");

/* ***********************
 * Middleware
 *************************/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

// Session configuration
app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use(apiRoutes);
app.use(swaggerRoute);

app.get("/", (req, res) => {
  if (req.user) {
    res.json({ message: "Logged in", user: req.user.id });
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
