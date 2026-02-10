import api from "./client";
import { handleApiError } from "../utils/error";

// 회원가입: POST /api/users
export const signupApi = async ({ name, email, password }) => {
  try {
    const res = await api.post("/users", { name, email, password });
    return res.data; // { message, id }
  } catch (err) {
    handleApiError(err, "회원가입 처리 중 문제가 발생했어요.");
  }
};

// 로그인: POST /api/users/login
export const signinApi = async ({ email, password }) => {
  try {
    const res = await api.post("/users/login", { email, password });
    return res.data; // { message, token, user: { id, email, name } }
  } catch (err) {
    handleApiError(err, "로그인 처리 중 문제가 발생했어요.");
  }
};
