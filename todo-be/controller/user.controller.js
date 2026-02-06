const bcrypt = require("bcryptjs");
const User = require("../model/User");

const SALT_ROUNDS = 10; // 해싱 연산 강도(cost factor)

const userController = {};

// 회원가입
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
    const existingUser = await User.findOne({ email });
    // findOne: 조건에 맞는 문서 1개만 조회 (없으면 null 반환)
    // { email } : email 필드가 요청값과 같은 유저 검색
    // 두 번째 인자로 특정 필드 제외 가능:
    // 예) User.findOne({ email }, "-createdAt -updatedAt -__v")

    if (existingUser) {
      return res.status(409).json({
        message: "이미 존재하는 이메일입니다",
      });
    }

    // 2. 비밀번호 해싱(bcrypt 적용) - 패스워드 암호화
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
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
      id: newUser._id,
    });
  } catch (error) {
    // (중요) unique 중복키 에러(E11000) -> 409로 처리
    if (error?.code === 11000) {
      return res.status(409).json({
        message: "이미 존재하는 이메일입니다",
      });
    }

    res.status(500).json({
      message: "서버 오류 발생",
      error: error.message,
    });
  }
};

// 로그인
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
    // (안전장치) 나중에 password를 select:false로 바꿔도 로그인에서 가져오도록 +password
    // const user = await User.findOne({ email }).select("+password");
    const user = await User.findOne({ email });

    // user 없음 / password 틀림을 같은 메시지 + 같은 코드(401)로 통일
    if (!user) {
      return res.status(401).json({
        message: "이메일 또는 비밀번호가 올바르지 않습니다",
      });
    }

    // bcrypt.compare로 입력된 비밀번호 vs DB 해시 비교
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "이메일 또는 비밀번호가 올바르지 않습니다",
      });
    }

    // JWT 토큰 발급(User 모델 메서드 사용)
    const token = user.generateToken();

    // user에 password가 포함되어있으니 필요한 필드만 선택해서 응답
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
