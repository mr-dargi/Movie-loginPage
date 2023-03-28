const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/user");

JWT_SECRET = "slkdfjojfasnviearfoowe@lkjas#alsdkjfljsaldfk";

// express app
const app = express();

// register view engine
app.set("view engine", "ejs");

// middleware & static file
app.use(express.static("public"));
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }))

// connect to mongodb
const dbURI = "mongodb://localhost:27017";

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

// post actions
app.post("/sign-up", async (req, res) => {
  const { email, username, password: plainTextPassword } = req.body;

  if(!username || typeof username !== "string") {
    return res.json({
      status: "error",
      error: "Invalid username"
    })
  };

  if(!plainTextPassword || typeof plainTextPassword !== "string") {
    return res.json({
      status: "error",
      error: "Invalid password"
    })
  };

  if(plainTextPassword < 8) {
    return res.json({
      status: "error",
      error: "Password is too small, the password should be atleast 8 character"
    })
  };

  // hashing a password
  const password = await bcrypt.hash(plainTextPassword, 10);

  // pass email, username and password to mongodb
  try {
    const response = await User.create({
      email,
      username,
      password
    });
    console.log("User Created successfully: ", response);
  } catch(error) {
    if(error.code === 11000) {
      return res.json({
        status: "error",
        error: "Username or email is already exist"
      })
    }
    throw error
  };

})

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username }).lean();

  if(!user) {
    return res.json({
      status: "error",
      error: "Invalid Username/Password"
    })
  };

  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({
      id: user._id,
      username: user.username
    },
    JWT_SECRET
    );

    res.json({ 
      status: "ok",
      data: token
     })
  } else {
    return res.json({
      status: "error",
      error: "Invalid Username/Password"
    })
  }
})


// 404 page
app.use((req, res) => {
  res.status(404).render("404", { title: "404" });
});