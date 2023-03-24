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
app.get("/", (req, res) => {
  res.redirect("/login");
})

app.get("/login", (req, res) => {
  res.render("login", { title: "LOGIN PAGE" });
})

app.get("/login", (req, res) => {
  res.render("sign-up", { title: "SIGN UP" });
})

app.get("/login", (req, res) => {
  res.render("changing-password", { title: "CHANGING PASSWORD" });
})

app.use((req, res) => {
  res.status(404).render("404", { title: "404" });
})