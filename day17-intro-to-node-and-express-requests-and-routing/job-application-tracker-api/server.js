const express = require("express");
const app = express();
const port = 4000;
const jobs = require("./jobs");

function getNextIdFromCollection(collection) {
  if(collection.length === 0) return 1; 
  const lastRecord = collection[collection.length - 1];
  return lastRecord.id + 1;
}

app.get("/", (req, res) => {
  res.send("Welcome to the Job Application Tracker API!");
});


// middleware that allows to console.log and good for debugger
app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.originalUrl}`);
  next();
});
// add this line
app.use(express.json()) // this allows us to send JSON formatted bodies in our requests
// ... route handlers
// app.listen(...


// This is a must have!!
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

// List all jobs
app.get("/jobs", (req, res) => {
  res.send(jobs);
});

app.get("/jobs/:id", (req, res) => {
  const jobId = parseInt(req.params.id, 10);
  const job = jobs.find((job) => job.id === jobId);
  res.send(job);

});

// Create a new job
app.post("/jobs", (req, res) => {
  // This will eventually create a new job
  const newJob = {
    ...req.body,
    id: getNextIdFromCollection(jobs)
  };
  console.log("newJob", newJob);
  jobs.push(newJob);
  res.send(newJob);
});

// Update a specific job
app.patch("/jobs/:id", (req, res) => {
  const jobId = parseInt(req.params.id, 10);
  const jobUpdates = req.body;
  const jobIndex = jobs.findIndex(job => job.id === jobId);
  const updatedJob = { ...jobs[jobIndex], ...jobUpdates };
  jobs[jobIndex] = updatedJob;
  // console.log("updatedJob", updatedJob);
  res.send(updatedJob);
});

// Delete a specific job
app.delete("/jobs/:id", (req, res) => {
  const jobId = parseInt(req.params.id, 10);
  const jobIndex = jobs.findIndex(job => job.id === jobId);
  jobs.splice(jobIndex, 1);
  res.send({ message: "Job deleted successfully" });
});