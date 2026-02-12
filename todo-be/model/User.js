const { Schema, model } = require("mongoose");
const jwt = require("jsonwebtoken");

/**
 * User Schema
 * - timestamps: createdAt / updatedAt 자동 생성
 */
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  { timestamps: true }, // 유저가 언제 생성되는지 기록
);

/**
 * JSON 변환 시 민감정보 제거 (실무에서 많이 씀)
 * - res.json(user) 처럼 문서를 그대로 내려도 password가 자동으로 빠짐
 * - __v(버전 필드)도 필요 없으면 함께 제거
 */
userSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});

/**
 * 인스턴스 메서드: JWT 토큰 생성
 * - payload에는 민감정보를 넣지 않기
 */
userSchema.methods.generateToken = function () {
  const secret = process.env.JWT_SECRET_KEY;

  if (!secret) {
    throw new Error("JWT_SECRET_KEY 환경변수가 설정되지 않았습니다");
  }
  // payload: 토큰에 담을 정보(민감정보는 넣지 않기)
  return jwt.sign(
    {
      userId: this._id,
      email: this.email,
    },
    secret,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }, // 예: "1h", "7d", "30m"
  );
};

const User = model("User", userSchema);

module.exports = User;

/**
 * =========================
 * 참고(legacy / 학습용 메모)
 * =========================
 *
 * [toJSON 처리 대안들]
 *
 * (1) methods.toJSON 방식 (강의) - _doc 직접 접근
 * - 직관적이고 간단하지만 Mongoose 내부 구조에 의존함
 *
 * userSchema.methods.toJSON = function () {
 *   const obj = this._doc;
 *   delete obj.password;
 *   delete obj.updatedAt;
 *   delete obj.__v
 *   return obj;
 * };
 *
 * (2) methods.toJSON 방식 (권장) - 공식 API(toObject) 사용
 * - 안정적으로 plain object로 변환 후 민감정보 제거
 * - toObject()를 사용해 안정적으로 plain object로 변환
 * - res.json(user) 처럼 user 문서를 그대로 내려줄 때도 password가 자동으로 빠지게 함
 *
 * userSchema.methods.toJSON = function () {
 *   const obj = this.toObject();
 *   delete obj.password;  // 해싱된 비밀번호라도 응답에서 제외
 *   delete obj.__v; // mongoose 내부 버전 필드 제외 (선택)
 *   return obj;
 * };
 *
 * (3) schema.set("toJSON") 방식 (현재 적용 중)
 * - 실무에서 많이 쓰는 변환 옵션 설정 방식
 */
