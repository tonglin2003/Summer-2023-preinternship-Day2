const { Pool } = require('pg');
require('dotenv').config();

// test out if works by typing, node <fileName: database.js> in the terminal
// console.log(process.env.DB_NAME);

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,

});

const testConnection = async () => {
    try {
        const res = await pool.query('SELECT NOW()');
        console.log('Connection to the database successful');
        console.log('Current timestamp from the database:', res.rows[0].now);
    } catch (error) {
        console.error('An error occurred:', error);
    } finally {
        pool.end(); // Close the pool connection when finished
    }
};

const createTableQuery =`
    CREATE TABLE IF NOT EXISTS job_application(
        id SERIAL PRIMARY KEY,
        company VARCHAR(100) NOT NULL,
        title VARCHAR(100) NOT NULL,
        minSalary INT,
        location VARCHAR(100),
        postDate DATE,
        jobPostUrl TEXT,
        applicationDate DATE,
        lastContactDate DATE,
        companyContact VARCHAR(100),
        status INT NOT NULL DEFAULT 1
    );
`;

const checkTable = async () => {
    try {
      const res = await pool.query('SELECT * FROM job_application;');
      console.log('Table exists.');
      console.log('Rows:', res.rows);
    } catch (error) {
      if (error.code === '42P01') {
        console.log('Table does not exist.');
        // Perform any required actions when the table doesn't exist
      } else {
        console.error('An error occurred:', error);
      }
    } finally {
      pool.end(); // Close the pool connection when finished
    }
  };

  const createJobAppsTable = async () => {
    try {
      const result = await pool.query(createTableQuery);
      console.log("Creating table was successful");
      console.log("Result:", result);
    } catch (error) {
      console.error("Table creation failed:", error);
    } finally {
      pool.end(); // Close the pool connection when finished
    }
  };
// testConnection();

// createJobAppsTable(); 
// checkTable();

module.exports = {
    query: (text, params, callback) => {
        console.log("QUERY: ", text, params || "");
        return pool.query(text, params, callback);
    },
};
