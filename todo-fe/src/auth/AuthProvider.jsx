import { useMemo, useState } from "react";
import { signinApi, signupApi } from "../api/authApi";
import { AuthContext, STORAGE_KEY } from "./AuthContext";

const readAuthFromStorage = () => {
  const saved = sessionStorage.getItem(STORAGE_KEY);
  if (!saved) return null;

  try {
    return JSON.parse(saved);
  } catch {
    sessionStorage.removeItem(STORAGE_KEY);
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(readAuthFromStorage);

  const signin = async ({ email, password }) => {
    const data = await signinApi({ email, password });
    const nextAuth = { token: data.token, user: data.user };

    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(nextAuth));
    setAuth(nextAuth);

    return nextAuth;
  };

  const signup = async ({ name, email, password }) => {
    await signupApi({ name, email, password });
    return true;
  };

  const signout = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setAuth(null);
  };

  const value = useMemo(
    () => ({
      user: auth?.user ?? null,
      token: auth?.token ?? null,
      isAuthed: !!auth?.token,
      signin,
      signup,
      signout,
    }),
    [auth],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
