const bcrypt = require("bcryptjs");
const User = require("../model/User");

// POST /api/users/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "이메일/비밀번호를 입력해 주세요." });
    }

    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(401)
        .json({ message: "이메일 또는 비밀번호가 올바르지 않습니다" });

    // bcrypt 비교로 통일 (회원가입에서 해시 저장했으니까)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "이메일 또는 비밀번호가 올바르지 않습니다" });
    }

    const token = user.generateToken();

    return res.json({
      message: "로그인 성공",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "로그인 처리 중 오류가 발생했습니다." });
  }
};

// GET /api/users/me
exports.me = async (req, res) => {
  try {
    // auth middleware가 req.userId를 세팅해줌
    const user = await User.findById(req.userId).select("-password -__v");
    if (!user)
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });

    return res.status(200).json({ user }); // toJSON 처리해두면 password 숨김됨
  } catch (err) {
    return res
      .status(500)
      .json({ message: "유저 정보 조회 중 오류가 발생했습니다." });
  }
};
