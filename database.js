const { Pool } = require('pg');
require('dotenv').config();

//this pool gives us a connection to the database with the credentials in the .env file.
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});

//creates a database table in the day17dbtest database
const createTableQuery = `
    CREATE TABLE IF NOT EXISTS transactionsTable(
        id SERIAL PRIMARY KEY,
        date DATE,
        description VARCHAR(100) NOT NULL,
        category VARCHAR(100) NOT NULL,
        amount INTEGER,
        type VARCHAR(100)
    );
`;
//execute the query on the database
const createTransactionsTable = async() => {
    try{
        await pool.query(createTableQuery);
        console.log('Table created succesfully');
    }catch(error){
        console.log("An error occured while creating the table", error.stack);
    }
};

createTransactionsTable();

module.exports = {
    query: (text, params, callback) => {
      console.log("QUERY:", text, params || "");
      return pool.query(text, params, callback);
    },
  };