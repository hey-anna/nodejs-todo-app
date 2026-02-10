import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";
import TodoPage from "../pages/TodoPage";
import SignInPage from "../pages/SignInPage";
import SignupPage from "../pages/SignupPage";
import RequireAuth from "../auth/RequireAuth";
import RequireGuest from "../auth/RequireGuest";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: (
          <RequireAuth>
            <TodoPage />
          </RequireAuth>
        ),
      },
      {
        path: "signin",
        element: (
          <RequireGuest>
            <SignInPage />
          </RequireGuest>
        ),
      },
      {
        path: "signup",
        element: (
          <RequireGuest>
            <SignupPage />
          </RequireGuest>
        ),
      },
    ],
  },
]);
