const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

JWT_SECRET = "slkdfjojfasnviearfoowe@lkjas#alsdkjfljsaldfk";

// movie_login, movie_signUp, movie_changePassword
const movie_login = async (req, res) => {
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
    res.json({
      status: "error",
      error: "Invalid Username/Password"
    })
  }
};

const movie_signUp = async (req, res) => {
  const { email, username, password: plainTextPassword } = req.body;

  if(!username || typeof username !== "string") {
    return res.json({ 
        status: "error",
        error: "Invalid username"
    });
}

if(!plainTextPassword || typeof plainTextPassword !== "string") {
    return res.json({ 
        status: "error",
        error: "Invalid password"
    });
}

if(plainTextPassword.length < 8) {
    return res.json({ 
        status: "error",
        error: "Password is too small, the password should be atleast 8 characters"
    });
}

  // hashing a password
  const password = await bcrypt.hash(plainTextPassword, 10);

  // pass email, username and password to mongodb
  try {
    const response = await User.create({
      email,
      username,
      password
    });
    return res.json({ 
      status: "ok",
     });
  } catch(error) {
    if(error.code === 11000) {
      return res.json({
        status: "error",
        error: "Username or email is already exist"
      })
    }
    throw error
  };
};

const movie_changePassword = async (req, res) => {
  const { token, oldPassword, newPassword } = req.body;

  console.log(token, oldPassword, newPassword);


  if(!oldPassword || typeof oldPassword !== "string") {
    return res.json({
      status: "error",
      error: "Invalid password"
    })
  }

  if(!newPassword || typeof newPassword !== "string") {
    return res.json({
      status: "error",
      error: "Invalid password"
    })
  }

  if(newPassword.length < 8) {
    return res.json({
      status: "error",
      error: "Password is too small, the password should be atleast 8 character"
    })
  }


  try {
    const user = jwt.verify(token, JWT_SECRET);

    const _id = user.id;

    const findUser = await User.findOne({ _id }).lean();

    console.log(findUser);

    if(await bcrypt.compare(oldPassword, findUser.password)) {
      const hashPassword = await bcrypt.hash(newPassword, 10);

      await User.updateOne({ _id }, {
        $set: { password: hashPassword }
      })
    }

    res.json({
      status: "ok"
    })
  } catch(error) {
    res.json({
      status: "error",
      error: ":))"
    })
  }
}


module.exports = {
  movie_login,
  movie_signUp,
  movie_changePassword
}
