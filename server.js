/* ***********************
 * Require Statements
 *************************/
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const apiRoutes = require("./routes/");
const swaggerRoute = require("./routes/swagger");
const passport = require("passport");
const session = require("express-session");
require("./config/passport");

/* ***********************
 * Middleware
 * ************************/

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// CORS middleware
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

app.use(async (req, res, next) => {
	res.status(404).json({ message: "Unknown endpoint." });
});

const port = process.env.PORT;
const host = process.env.HOST;

app.listen(port, () => {
	console.log(`app listening on ${host}:${port}`);
});
