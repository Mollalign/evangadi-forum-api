const express = require('express');
const questionsRoutes = express.Router();

// auth middleware
const authMiddleware = require('../middlewares/authMiddleware');

questionsRoutes.get("/all-questions", authMiddleware, (req, res) => {
  res.send("all-question")
});

module.exports = questionsRoutes;
