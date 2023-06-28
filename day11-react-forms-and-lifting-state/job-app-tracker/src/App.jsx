import { useState } from "react";
import classNames from "classnames";
import JobCard from "./JobCard";
import jobsData from "./jobs";
import "./App.css";
import Modal from "./ui/Modal";

const statuses = {
  1: "Bookmarked",
  2: "Applying",
  3: "Applied",
  4: "Interviewing",
  5: "Negotiating",
  6: "Accepted",
};

function App() {
  const [selectedStatus, setSelectedStatus] = useState(1);
  const [jobs, setJobs] = useState(jobsData);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const filteredJobs = jobs.filter(job => job.status === selectedStatus)

  const jobCards = filteredJobs.map((job, i) => {
    return <JobCard job={job} key={i} />;
  });

  const statusButtons = Object.keys(statuses).map(statusId => {
    const buttonClass = classNames(
      "px-4 py-2 border",
      {
        "bg-blue-500": selectedStatus === parseInt(statusId)
      }
    )
    return (
      <button
        key={statusId}
        className={buttonClass}
        onClick={() => setSelectedStatus(parseInt(statusId))}
      >
        {statuses[statusId]}
      </button>
    );
  })

  return (
    <div className="mx-auto max-w-4xl">
      <Modal isVisible={isModalVisible} hideModal={() => setIsModalVisible(false)}  children="hello" >

      </Modal>
      <h1>Job Application Tracker</h1>
      <div className="grid grid-cols-6 my-4">{statusButtons}</div>
      <div className="flex justify-between mb-4">
      <div></div>
      <div><button className="bg-blue-500 px-4 py-2" onClick={() => setIsModalVisible(true)}>+ Add Job</button></div>
    </div>
    

      {jobCards}
    </div>
  );
}

export default App;
