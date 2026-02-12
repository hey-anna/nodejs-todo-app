const bcrypt = require("bcryptjs");
const User = require("../model/User");

// 역할: User 리소스 관련 컨트롤러
// - createUser: 회원가입(중복 체크 + 비번 해싱 + 저장)
// - loginUser: 로그인(비번 검증 + JWT 발급)
// - me: 로그인한 유저 조회(auth 미들웨어가 req.userId를 세팅)

const SALT_ROUNDS = 10; // 해싱 연산 강도(cost factor), 값이 높을수록 더 느리지만 보안성↑

const userController = {};

// 회원가입
// POST /api/users
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
    const user = new User({
      email,
      name,
      password: hashedPassword, // 평문이 아닌 해싱된 비밀번호만 저장
    });

    await user.save();

    // 4. 응답 보내기
    res.status(201).json({
      message: "회원가입 성공",
      id: user._id,
    });
  } catch (error) {
    // (중요) unique 중복키 에러(E11000) -> 409로 처리
    if (error?.code === 11000) {
      return res.status(409).json({
        message: "이미 존재하는 이메일입니다",
      });
    }

    return res.status(500).json({
      message: "회원가입 중 서버 오류가 발생했습니다.",
      error: error.message,
    });
  }
};

// 로그인
// POST /api/users/login
userController.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 입력값 검증
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "이메일/비밀번호를 입력해 주세요." });
    }

    // DB에서 입력받은 이메일로 가입된 유저 조회
    // (안전장치) password를 select:false로 숨겨도 로그인에서는 +password로 가져옴
    const user = await User.findOne({ email }).select("+password");

    // user 없음 / password 틀림을 같은 메시지 + 같은 코드(401)로 통일
    if (!user)
      return res
        .status(401)
        .json({ message: "이메일 또는 비밀번호가 올바르지 않습니다" });

    // bcrypt.compare로 입력된 비밀번호 vs DB 해시 비교
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "이메일 또는 비밀번호가 올바르지 않습니다" });
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
    return res.status(500).json({
      message: "로그인 처리 중 오류가 발생했습니다.",
      error: error.message,
    });
  }
};

// GET /api/users/me (auth 미들웨어 필요: req.userId 세팅 후 조회)
userController.me = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password -__v");
    if (!user) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }

    return res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "유저 정보 조회 중 오류가 발생했습니다." });
  }
};

module.exports = userController;
