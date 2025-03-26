const express = require("express");
const cors = require("cors");
const ApiError = require("./app/api-error");
const app = express();

const path = require("path");
app.use("/public", express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3001", // Chỉ định frontend được phép
    credentials: true, // Cho phép gửi cookies
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
const cookieParser = require("cookie-parser");
app.use(cookieParser());

// const contactsRouter = require("./app/routes/contact.route");
const booksRouter = require("./app/routes/book.route");
const authsRouter = require("./app/routes/auth.route");
const usersRouter = require("./app/routes/user.route");
const categorysRouter = require("./app/routes/category.route");
const publishersRouter = require("./app/routes/publisher.route");
const borrowservicesRouter = require("./app/routes/borrow.route");
const employeesRouter = require("./app/routes/employee.route");
// app.get("/", (req, res) => {
//   res.json({ message: "Welcome to contact booj application." });
// });
// app.use("/api/contacts",contactsRouter);


app.use("/api/books", booksRouter);

app.use("/api/auth", authsRouter);

app.use("/api/user", usersRouter);

app.use("/api/category", categorysRouter);
app.use("/api/publisher", publishersRouter);
app.use("/api/borrow_service", borrowservicesRouter);
app.use("/api/employee", employeesRouter);

app.use((req, res, next) => {
  return next(new ApiError(404, "Not found"));
});

//define error-handling middleware last, after other app.user() and routes calls
app.use((err, req, res, next) => {
  return res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;
