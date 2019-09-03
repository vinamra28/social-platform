//npm run server for running the nodemon
//npm start
const express = require("express");
const bodyParser = require("body-parser");
require("./core/mongo")();
const passport = require("passport");

const app = express();

var api = require("./routes/api");

//Passport middleware
app.use(passport.initialize());

//Passport Config
require("./config/passport")(passport);

//Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/api", api);

app.get("/hello", (req, res) => res.send("Hello World"));

module.exports = app;
