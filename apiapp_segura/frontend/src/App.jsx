import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./AuthProvider";
import { ProtectedRoute } from "./ProtectedRoute";
import Login from "./Login";
import Home from "./Home";
import Detalles from "./Detalles";
import Filtrar from "./Filtrar";
import "./index.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/detalles" element={<ProtectedRoute><Detalles /></ProtectedRoute>} />
            <Route path="/filtrar" element={<ProtectedRoute><Filtrar /></ProtectedRoute>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}
export default App;
