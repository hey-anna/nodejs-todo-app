const bcrypt = require("bcryptjs");
const User = require("../model/User");

const saltRounds = 10; // 해싱 연산 강도(cost factor)

const userController = {};

userController.createUser = async (req, res) => {
  try {
    const { email, name, password } = req.body;

    // 입력값 검증
    if (!email || !name || !password) {
      return res.status(400).json({
        message: "필수 입력값이 누락되었습니다",
      });
    }

    // 1. 이미 가입된 유저인지 확인
    const existingUser = await User.findOne({ email }); // findOne 하나만 찾기

    if (existingUser) {
      return res.status(400).json({
        message: "이미 존재하는 이메일입니다",
      });
    }

    // 2. 비밀번호 해싱(bcrypt 적용) - 패스워드 암호화
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt); // password 유저한테 패스워드 받아서, salt 암호화 비밀번호 해싱

    // 3. 유저 저장
    const newUser = new User({
      email,
      name,
      password: hashedPassword, // 평문이 아닌 해싱된 비밀번호만 저장
    });

    await newUser.save();

    // 4. 응답 보내기
    res.status(201).json({
      message: "회원가입 성공",
    });
  } catch (error) {
    res.status(500).json({
      message: "서버 오류 발생",
      error: error.message,
    });
  }
};

userController.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 입력값 검증
    if (!email || !password) {
      return res.status(400).json({
        message: "이메일과 비밀번호를 입력해주세요",
      });
    }

    // DB에서 입력받은 이메일로 가입된 유저 조회
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "이메일 또는 비밀번호가 올바르지 않습니다",
      });
    }

    // bcrypt.compare를 사용해 입력된 비밀번호와 DB에 저장된 해시 비밀번호 비교
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "이메일 또는 비밀번호가 올바르지 않습니다",
      });
    }

    // JWT 토큰 발급(User 모델 메서드 사용)
    const token = user.generateToken();

    return res.status(200).json({
      message: "로그인 성공",
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "서버 오류 발생",
      error: error.message,
    });
  }
};

module.exports = userController;
