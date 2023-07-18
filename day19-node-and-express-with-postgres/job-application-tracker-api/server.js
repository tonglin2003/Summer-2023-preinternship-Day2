const express = require("express");
const app = express();
const port = 4000;
const jobs = require("./jobs");
require("dotenv").config();


const { query } = require('./database');

app.use((req, res, next) => {
  res.on("finish", () => {
    // the 'finish' event will be emitted when the response is handed over to the OS
    console.log(`Request: ${req.method} ${req.originalUrl} ${res.statusCode}`);
  });
  next();
});
app.use(express.json());

function getNextIdFromCollection(collection) {
  if (collection.length === 0) return 1;
  const lastRecord = collection[collection.length - 1];
  return lastRecord.id + 1;
}

app.get("/", (req, res) => {
  res.send("Welcome to the Job App Tracker API!!!!");
});

// Get all the jobs
app.get("/jobs", async (req, res) => {
  try{
    const allJobs = await query("SELECT * FROM job_application");
    res.status(200).json(allJobs.rows);
  }catch(error)
  {
    console.error(error);
  }
});

// Get a specific job
app.get("/jobs/:id", async (req, res) => {
  const jobId = parseInt(req.params.id, 10);
  try{
    const job = await query("SELECT * FROM job_application where id=$1", [jobId])
    
    if (job.rows.length > 0) 
    {
      res.status(200).json(job.rows[0]);
    }
    else{
      res.status(404).send({message: "Job not found"});
    }

  }catch(error)
  {
    console.error(error)
  }
});

// Create a new job
app.post("/jobs", async (req, res) => {
  const {
    company,
    title, 
    minSalary, 
    maxSalary, 
    location, 
    postDate, 
    jobPostUrl, 
    applicationDate, 
    lastContactDate, 
    companyContact, 
    status} = req.body;

  try{
    const newJob = await query(
      "INSERT INTO job_application (company,title, minSalary,  maxSalary, location, postDate, jobPostUrl, applicationDate, lastContactDate, companyContact, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *",
      [company,title, minSalary,  maxSalary, location, postDate, jobPostUrl, applicationDate, lastContactDate, companyContact, status]
    );
    res.status(201).json(newJob.rows[0]);

  }catch(error){
    console.error(error);
  }
});

// Update a specific job
app.patch("/jobs/:id", (req, res) => {
  const jobId = parseInt(req.params.id, 10);
  const jobUpdates = req.body;
  const jobIndex = jobs.findIndex((job) => job.id === jobId);
  if (jobIndex !== -1) {
    const originalJob = jobs[jobIndex];
    const updatedJob = {
      ...originalJob,
      ...jobUpdates,
    };
    jobs[jobIndex] = updatedJob;
    res.send(updatedJob);
  } else {
    res.status(404).send({ message: "Job not found" });
  }
});

// Delete a specific job
app.delete("/jobs/:id", (req, res) => {
  const jobId = parseInt(req.params.id, 10);
  const jobIndex = jobs.findIndex((job) => job.id === jobId);
  if (jobIndex !== -1) {
    jobs.splice(jobIndex, 1);
    res.send({ message: "Job deleted successfully" });
  } else {
    res.status(404).send({ message: "Job not found" });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});


