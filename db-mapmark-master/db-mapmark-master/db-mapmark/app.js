"use strict";
const debug = require("debug");
const express = require("express");
const path = require("path");
const favicon = require("serve-favicon");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

require("dotenv").config();


//ROUTES
const homeRoutes = require("./routes/home");
const userRoutes = require("./routes/user");
const locationRoutes = require("./routes/location");
const authRoutes = require("./routes/auth");

const app = express();

// view engine setup
app.set("views", "views");
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//CORS
app.use((req,res,next) => {
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Headers','*');
  res.setHeader('Access-Control-Allow-Methods','GET,POST,PATCH,DELETE');
  next();
})

app.use("/", homeRoutes);
app.use("/user", userRoutes);
app.use("/location", locationRoutes);
app.use("/auth", authRoutes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error("Page Not Found");
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get("env") === "development") {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500).json({message:err.message});
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500).json({message:err.message});
});

app.set("port", process.env.PORT || 3000);

const server = app.listen(app.get("port"), function () {
  debug("Express server listening on port " + server.address().port);
});
