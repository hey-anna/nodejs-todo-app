// 1. 필요한 모듈 불러오기
const express = require("express");
const mongoose = require("mongoose");
const indexRouter = require("./routes/index");

// 2. express 앱 생성
const app = express();

// 3. 미들웨어 설정 (express 내장 파서 사용)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. 라우터 연결
app.use("/api", indexRouter);

// 5. MongoDB 연결
const mongoURI = `mongodb://127.0.0.1:27017/todo-demo`;

mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB 연결 성공"))
  .catch((err) => console.error("MongoDB 연결 실패:", err));

// 6. 기본 라우트 테스트
app.get("/", (req, res) => {
  res.send("할인 앱 서버 실행 중!");
});

// 7. 서버 실행
const PORT = 5050;
app.listen(PORT, () => {
  console.log(`서버가 ${PORT}번 포트에서 실행 중`);
});
