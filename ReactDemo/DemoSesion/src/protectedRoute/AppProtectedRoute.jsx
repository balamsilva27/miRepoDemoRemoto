import {BrowserRouter, Route, Routes} from "react-router-dom";

export default function AppProtectedRoute() {
    return (
        <BrowserRouter>
            <Routes>
                {/* publica routes */}
                <Route path="/login" element={<Login onLogin={checkAuth} />} />
                {/* protected routes */}
                <Route path="/protected" element={<h1>Protected Route</h1>} />
                {/* default route */}
                <Route path="*" element={<h1>Not Found</h1>} />
            </Routes>
        </BrowserRouter>
    );
}