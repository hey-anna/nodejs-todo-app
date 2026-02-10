import { Navigate } from "react-router-dom";
import { useAuth } from "./useAuth";

export default function RequireGuest({ children }) {
  const { isAuthed } = useAuth();

  // 이미 로그인 상태면 로그인/회원가입 페이지 접근 금지 -> Todo로
  if (isAuthed) return <Navigate to="/" replace />;

  return children;
}
