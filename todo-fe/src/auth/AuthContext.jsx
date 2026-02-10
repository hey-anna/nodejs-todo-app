import { createContext } from "react";

/**
 * @typedef {{ _id?: string, name?: string, email?: string }} AuthUser
 * @typedef {{ token: string, user: AuthUser }} AuthState
 *
 * @typedef {{
 *  user: AuthUser | null,
 *  token: string | null,
 *  isAuthed: boolean,
 *  signin: (args: {email: string, password: string}) => Promise<AuthState>,
 *  signup: (args: {name: string, email: string, password: string}) => Promise<true>,
 *  signout: () => void
 * }} AuthContextValue
 */

/** @type {import("react").Context<AuthContextValue | null>} */
export const AuthContext = createContext(null);
