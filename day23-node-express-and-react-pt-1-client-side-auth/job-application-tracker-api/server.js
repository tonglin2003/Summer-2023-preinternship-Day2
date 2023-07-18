const express = require("express");
const session = require("express-session");
const app = express();
const port = 4000;
require("dotenv").config();
const cors = require("cors");
const authRouter = require("./routes/auth");
const jobsRouter = require("./routes/jobs");
const {
  forbiddenErrorHandler,
  notFoundErrorHandler,
} = require("./middleware/errorHandlers");

app.use(
  cors({
    origin: "http://localhost:5173",
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PATCH", "DELETE"],
  })
);

app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.originalUrl}`);
  res.on("finish", () => {
    // the 'finish' event will be emitted when the response is handed over to the OS
    console.log(`Response Status: ${res.statusCode}`);
  });
  next();
});

app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 3600000, // 1 hour
    },
  })
);
app.use(forbiddenErrorHandler);
app.use(notFoundErrorHandler); 


app.use(
  cors({
    origin: "http://localhost:5173",
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PATCH", "DELETE"],
  })
);

// routes
app.use("/api/auth", authRouter);
app.use("/api/jobs", jobsRouter);


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
