const express = require("express");
const router = express.Router();

const taskApi = require("./task.api");
const userApi = require("./user.api");

router.use("/tasks", taskApi);
router.use("/users", userApi);

module.exports = router;
