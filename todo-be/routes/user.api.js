const express = require("express");
const router = express.Router();
const userController = require("../controller/user.controller");
const authController = require("../controller/auth.controller");
const auth = require("../middleware/auth");

// 회원가입
router.post("/", userController.createUser);

// 로그인 (토큰 발급)
router.post("/login", authController.login);

// 내 정보 (로그인 필요) - 토큰을 통해 유저 id 빼내고, => 그 아이디로 유저 객체 찾아서 보내주기
router.get("/me", auth, authController.me);

// 로그아웃(선택) - JWT면 보통 클라에서 토큰 제거가 핵심
router.post("/logout", (req, res) => {
  res.json({ message: "로그아웃 성공" });
});

module.exports = router;
