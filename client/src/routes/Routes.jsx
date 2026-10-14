import { Route, Routes } from "react-router-dom";
import ProtectedRoutes from "./ProtectedRoutes";
import { lazy, Suspense } from "react";
import { AppleSpinner } from "../components/AppleSpinner";

const Dashboard = lazy(() => import("../pages/Dashboard"));
const Profile = lazy(() => import("../pages/Profile"));

const Notifications = lazy(() => import("../pages/Notifications"));

const Settings = lazy(() => import("../pages/Settings"));

const Tasks = lazy(() => import("../pages/Tasks"));

const TasksDetails = lazy(() => import("../pages/TasksDetails"));

const Login = lazy(() => import("../pages/Login"));

function AppRoutes() {
  return (
    <Suspense fallback={<AppleSpinner />}>
      <Routes>
        <Route path="/login" element={<Login />} />{" "}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoutes>
              <Dashboard />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/tasks"
          element={
            // <ProtectedRoutes>
            <Tasks />
            // {/* </ProtectedRoutes> */}
          }
        />
        <Route
          path="/tasks/:id"
          element={
            <ProtectedRoutes>
              <TasksDetails />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoutes>
              <Profile />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/notifications"
          element={
            // <ProtectedRoutes>
            <Notifications />
            // {/* </ProtectedRoutes> */}
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoutes>
              <Settings />
            </ProtectedRoutes>
          }
        />
      </Routes>
    </Suspense>
  );
}
export default AppRoutes;
