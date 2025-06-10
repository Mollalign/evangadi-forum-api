const express = require('express');
const userRoutes = express.Router();

// auth middleware
const authMiddleware = require('../middlewares/authMiddleware')

// user controllers
const {register, login, checkUser} = require("../controllers/userController");

// register route
userRoutes.post("/register", register);

// login user
userRoutes.post("/login", login);

// check user
userRoutes.get("/check", authMiddleware, checkUser);

module.exports = userRoutes;