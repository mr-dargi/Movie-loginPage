const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const User = require("./models/user");

// express app
const app = express();

// register view engine
app.set("view engine", "ejs");

// middleware & static file
app.use(express.static("public"));
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }))

// listen for request
app.listen(3000, () => {
  console.log("listining on port 3000");
});

// router 
app.get("/", (req, res) => {
  res.redirect("/login");
});

app.get("/login", (req, res) => {
  res.render("login", { title: "LOGIN PAGE" });
});

app.get("/sign-up", (req, res) => {
  res.render("sign-up", { title: "SIGN UP" });
});

app.get("/change-password", (req, res) => {
  res.render("change-password", { title: "CHANGING PASSWORD" });
});

// post actions
app.post("/login", (req, res) => {
  console.log(req.body);
})



// 404 page
app.use((req, res) => {
  res.status(404).render("404", { title: "404" });
});