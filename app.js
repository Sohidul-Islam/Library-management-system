var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
require("dotenv").config({
    path: path.join(__dirname, ".env"),
});

var indexRouter = require("./routes/index");
var signUpRouter = require("./routes/signUpRouter");
const resetPasswordRoute = require("./routes/resetPasswordRoute");
var signInRoute = require("./routes/signInRoute");
var verifyRoute = require("./routes/verifyRoute");
var booksRoute = require("./routes/booksRoute");
var profileRoute = require("./routes/profileRoute");
var categoryRoute = require("./routes/categoryRoute");
var itemReviewsRouter = require("./routes/itemReviewsRouter");
var userRoute = require("./routes/userRoute");
var authorsRoute = require("./routes/authorsRoute");
var pdfRoute = require("./routes/pdfRoute");

var app = express();
// set  DEBUG=library-management-system:* & npm start

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/sign-up", signUpRouter);
app.use("/reset-password", resetPasswordRoute);
app.use("/sign-in", signInRoute);
app.use("/verify", verifyRoute);
app.use("/books", booksRoute);
app.use("/profile", profileRoute);
app.use("/category", categoryRoute);
app.use("/item-reviews", itemReviewsRouter);
app.use("/users", userRoute);
app.use("/authors", authorsRoute);
app.use("/pdf", pdfRoute);

// // catch 404 and forward to error handler
// app.use(function (req, res, next) {
//     next(createError(404));
// });

// // error handler
// app.use(function (err, req, res, next) {
//     // set locals, only providing error in development
//     res.locals.message = err.message;
//     res.locals.error = req.app.get("env") === "development" ? err : {};

//     // render the error page
//     res.status(err.status || 500);
//     res.render("error");
// });

module.exports = app;
