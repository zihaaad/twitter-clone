import {createBrowserRouter} from "react-router-dom";
import RootLayout from "../RootLayout";
import Home from "../pages/home/Home";
import Notifications from "../pages/notifications/Notifications";
import Profile from "../pages/profile/Profile";
import Login from "../pages/auth/login/Login";
import SignUp from "../pages/auth/signup/SignUp";
import {ProtectedRoutes} from "./ProtectedRoutes";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoutes>
        <RootLayout />
      </ProtectedRoutes>
    ),
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/notifications",
        element: <Notifications />,
      },
      {
        path: "/profile/:username",
        element: <Profile />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
]);

export default router;
