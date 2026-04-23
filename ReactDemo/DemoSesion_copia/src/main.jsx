import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import AppCookieHttpOnly from "./cookieHttpOnly/AppCookieHttpOnly";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <AppCookieHttpOnly />
    </StrictMode>
);
