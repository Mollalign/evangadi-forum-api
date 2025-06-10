require("dotenv").config();
const express = require("express");
const app = express();
const port = 3000;

// json middleware to extract json data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// db connection
const dbConnection = require("./db/dbConfig")

// user routes middleware file
const userRoutes = require("./routes/userRoute");

//  questions routes middleware file
const questionsRoutes = require('./routes/questionRoute')


// user routes mi ddleware
app.use("/api/users", userRoutes);

// question routes middleware
app.use("/api/questions", questionsRoutes);

// // answer routes middleware
// app.use();

async function start() {
  try {
   const result = await dbConnection.execute("select 'test' ");
   console.log("Database Connection established!");
   await app.listen(port);
   console.log(`Listening on ${port}`);

  } catch (error) {
    console.log(error.message)
  } 
}
start();
