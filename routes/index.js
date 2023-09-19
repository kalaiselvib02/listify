
const express = require("express");

let authRoutes = require("./authRoutes");

let taskRoutes = require("./tasksRoute");

let router = express.Router();

router.use("/auth" , authRoutes);

router.use(taskRoutes);

module.exports = router;
