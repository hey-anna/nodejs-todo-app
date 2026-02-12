const jwt = require("jsonwebtoken");

// 역할: JWT 토큰 검증 미들웨어
// - Authorization: Bearer <token> 형식 확인
// - jwt.verify로 유효성 검증
// - 성공 시 req.userId(req.userEmail) 세팅 후 next()
// ※ 여기서는 DB 조회(유저 찾기)를 하지 않는다. (역할 분리)

module.exports = function auth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "로그인이 필요합니다." });
  }

  const [type, token] = authHeader.split(" ").filter(Boolean);

  if (type !== "Bearer" || !token) {
    return res
      .status(401)
      .json({ message: "Authorization 형식이 올바르지 않습니다." });
  }

  const secret = process.env.JWT_SECRET_KEY;
  if (!secret) {
    return res.status(500).json({ message: "서버 JWT 설정이 누락되었습니다." });
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.userId = decoded.userId;
    req.userEmail = decoded.email;
    return next();
  } catch (err) {
    return res
      .status(401)
      .json({ message: "토큰이 만료되었거나 유효하지 않습니다." });
  }
};
