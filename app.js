const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const movieLoginPageRouters = require("./routers/movieLoginPageRouters")

// express app
const app = express();
app.use(express.json());

// register view engine
app.set("view engine", "ejs");

// middleware & static file
app.use(express.static("public"));
app.use(morgan("dev"));


// connect to mongodb
const dbURI = "mongodb://localhost:27017/users";

mongoose.connect(dbURI)
  .then(
    // listen for request
    app.listen(3000, () => {
      console.log("listining on port 3000");
    })
  )
  .catch(err => console.log(err));


// router 
app.get("/", (req, res) => {
  res.redirect("/login");
});


app.get("/login", (req, res) => {
  res.render("login", { title: "LOGIN PAGE", img: "login" });
});


app.get("/sign-up", (req, res) => {
  res.render("sign-up", { title: "SIGN UP", img: "signUp"  });
});


app.get("/change-password", (req, res) => {
  res.render("change-password", { title: "CHANGING PASSWORD" });
});


// api routes
app.use("/api", movieLoginPageRouters);


// 404 page
app.use((req, res) => {
  res.status(404).render("404", { title: "404" });
});