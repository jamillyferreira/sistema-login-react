import { Navigate, Route, Routes } from "react-router";
import Register from "./pages/register/Register";
import Login from "./pages/login/Login";
import ForgotPassword from "./pages/forgotPassword/ForgotPassword";
import ResetPassword from "./pages/resetPassword/ResetPassword";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Profile from "./pages/profile/Profile";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/profile" element={<Profile />} />
      </Route>

      <Route path="*" element={<p>Página não encontrada</p>} />
    </Routes>
  );
}

export default App;
