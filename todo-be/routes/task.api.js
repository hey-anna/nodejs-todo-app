const express = require("express");
const router = express.Router();

const taskController = require("../controller/task.controller");
const auth = require("../middleware/auth");

// 모든 Task CRUD 요청에 JWT 토큰 인증 미들웨어 적용
router.use(auth);

router.post("/", taskController.createTask);
router.get("/", taskController.getTask);
router.put("/:id", taskController.updateTask);
router.delete("/:id", taskController.deleteTask);

module.exports = router;
