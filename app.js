const createError = require("http-errors");
const express = require("express");
require("dotenv").config();
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const { errorHandler } = require("./middleware/errorMiddleware");
const connectDB = require("./config/db");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

const app = express();

connectDB();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/api/products", require("./routes/productRouter"));
app.use("/api/categories", require("./routes/categoryRouter"));
app.use("/api/users", require("./routes/userRouter"));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(errorHandler);

module.exports = app;
