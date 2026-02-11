const jwt = require("jsonwebtoken");

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
