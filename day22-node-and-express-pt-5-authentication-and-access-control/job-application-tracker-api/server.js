const express = require("express");
const app = express();
const port = 4000;
const { JobApplication, User } = require("./models");
require("dotenv").config();
const bcrypt = require('bcryptjs');
const session = require("express-session");


app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.originalUrl}`);
  res.on("finish", () => {
    // the 'finish' event will be emitted when the response is handed over to the OS
    console.log(`Response Status: ${res.statusCode}`);
  });
  next();
});
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 3600000 // 1 hour
  },
}));

app.get("/", (req, res) => {
  res.send("Welcome to the Job App Tracker API!!!!");
});

// Get all the jobs
app.get("/jobs", async (req, res) => {
  try {
    const allJobs = await JobApplication.findAll();

    res.status(200).json(allJobs);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: err.message });
  }
});

// Get a specific job
app.get("/jobs/:id", async (req, res) => {
  const jobId = parseInt(req.params.id, 10);

  try {
    const job = await JobApplication.findOne({ where: { id: jobId } });

    if (job) {
      res.status(200).json(job);
    } else {
      res.status(404).send({ message: "Job not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: err.message });
  }
});

// Create a new job
app.post("/jobs", async (req, res) => {
  try {
    const newJob = await JobApplication.create(req.body);

    res.status(201).json(newJob);
  } catch (err) {
    if (err.name === "SequelizeValidationError") {
      return res.status(422).json({ errors: err.errors.map((e) => e.message) });
    }
    console.error(err);
    res.status(500).send({ message: err.message });
  }
});

// Update a specific job
app.patch("/jobs/:id", async (req, res) => {
  const jobId = parseInt(req.params.id, 10);

  try {
    const [numberOfAffectedRows, affectedRows] = await JobApplication.update(
      req.body,
      { where: { id: jobId }, returning: true }
    );

    if (numberOfAffectedRows > 0) {
      res.status(200).json(affectedRows[0]);
    } else {
      res.status(404).send({ message: "Job not found" });
    }
  } catch (err) {
    if (err.name === "SequelizeValidationError") {
      return res.status(422).json({ errors: err.errors.map((e) => e.message) });
    }
    console.error(err);
    res.status(500).send({ message: err.message });
  }
});


// Delete a specific job
app.delete("/jobs/:id", async (req, res) => {
  const jobId = parseInt(req.params.id, 10);

  try {
    const deleteOp = await JobApplication.destroy({ where: { id: jobId } });

    if (deleteOp > 0) {
      res.status(200).send({ message: "Job deleted successfully" });
    } else {
      res.status(404).send({ message: "Job not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: err.message });
  }
});

app.post("/signup", async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  try {
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });

    // Send a response to the client informing them that the user was successfully created
    res.status(201).json({
      message: "User created!",
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      return res.status(422).json({ errors: err.errors.map((e) => e.message) });
    }
    res.status(500).json({
      message: "Error occurred while creating user",
      error: error,
    });
  }
});

app.post('/login',async (req, res)=>{
  try{
    const user = await User.findOne({where: {email: req.body.email}});

    if (user === null)
    {
      return res.status(401).json({
        message: "Incorrect credential",
      });
    }

    bcrypt.compare(req.body.password, user.password, (error, result)=>{
      if (result){
        // Password Match
        req.session.userId = user.id;
        res.status(200).json({ message: `Logged in successfully and user: ${user.id}` });
      }
      else{
        res.status(401).json({message: "Incorrect credential"});
      }
    })
    } catch(error) {
      console.error(error);
      res.status(500).json({message: "An error occurred during the login process"});
    }
})

app.delete('/logout', (req, res) => {
  req.session.destroy(err => {
      if (err) {
          return res.sendStatus(500);
      }

      res.clearCookie('connect.sid');
      return res.status(200).json({message: "loged out"});
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
