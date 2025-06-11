// db connection
const express = require("express");
const bcrypt = require('bcrypt');
const dbConnection = require("../db/dbConfig");
const jwt = require('jsonwebtoken');

async function register(req, res) {
  const { username, firstname, lastname, email, password } = req.body;

  if (!email || !password || !firstname, !lastname || !username) {
    return res.send("please provide all required information!")
  }

  try {
    const [user] = await dbConnection.query("SELECT username,userid FROM users WHERE username = ? or email = ? ", [username, email]);
    if (user.length > 0) {
      return res.status(400).json({ msg: "User Already registered" });
    }

    if(password.length < 8) {
      return res.status(400).json({ msg: "Password must be at least 8 characters" })
    }

    // encrypt the password
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    await dbConnection.query("INSERT INTO users (username, firstname, lastname, email, password) VALUE (?,?,?,?,?)", [username, firstname, lastname, email, hashedPassword]);

    return res.status(200).json({msg: "user registered"})

  } catch(error) {
    console.log(error.message);
    return res.status(500).json({msg: "Something went wrong, try again later!"})
  }
}


async function login(req, res) {
  const {email, password} = req.body;
  if (!email || !password) {
    return res.status(400).json({ msg: "please enter all required fields" });
  }
  
  try {
    const [user] = await dbConnection.query("SELECT username,userid,password FROM users WHERE email = ? ", [email]);
    if (user.length == 0) {
      return res.status(400).json({ msg: "invalid credential" });
    } 
    // compare password
    const isMatch = await bcrypt.compare(password, user[0].password);

    if (!isMatch) {
      return res.status(400).json({ msg: "invalid credential" });
    }

    const username = user[0].username;
    const userid = user[0].userid;

    const token = jwt.sign({username, userid}, process.env.JWT_SECRET, {
      expiresIn: "1d"
    });

    return res.status(200).json({msg: "user login successful", token, username})

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({msg: "Something went wrong, try again later!"});
  }
}

async function checkUser(req, res) {
  const {username, userid} = req.user;

  res.status(200).json({ msg: "valid user", username, userid });
}

module.exports = {
  register,
  login,
  checkUser,
}