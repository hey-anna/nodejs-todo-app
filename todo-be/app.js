// 1. 필요한 모듈 불러오기
// require("dotenv").config();
// dotenv는 package.json scripts에서 로드됨
// - npm run dev  → .env.development 사용
// - npm start    → .env.production 사용
// 따라서 app.js에서는 require("dotenv").config()를 직접 호출하지 않음

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const indexRouter = require("./routes/index");

// 2. express 앱 생성
const app = express();

// 3. 미들웨어 설정 (파서 + cors)
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. 라우터 연결
app.use("/api", indexRouter);

console.log("ENV:", process.env.NODE_ENV);
console.log("Mongo URI Loaded:", process.env.MONGODB_URI ? "yes" : "no");

// 5. MongoDB 연결 (connect는 딱 1번!)
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB 연결 성공"))
  .catch((err) => console.error("MongoDB 연결 실패:", err));

// 6. 기본 라우트 테스트
app.get("/", (req, res) => {
  res.send("할일 앱 서버 실행 중!");
});

// 7. 서버 실행
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`서버가 ${PORT}번 포트에서 실행 중`);
});
