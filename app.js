const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");

// express app
const app = express();

// register view engine
app.set("views engine", "ejs");

// middleware & static file
app.use(express.static("public"));
app.use(morgan("dev"));

// listen for request
app.listen(3000, () => {
  console.log("listining on port 3000");
})

// router 
