import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

import "./index.css";

createRoot(
    document.getElementById("root")!
).render(
    <StrictMode>
        <BrowserRouter>
            <ThemeProvider>
                <AuthProvider>
                    <App />

                    <Toaster
                        position="top-right"
                        reverseOrder={false}
                        gutter={12}
                        toastOptions={{
                            duration: 3000,
                            style: {
                                borderRadius: "12px",
                                padding: "14px 16px",
                                fontWeight: 600,
                            },
                            success: {
                                duration: 3000,
                            },
                            error: {
                                duration: 4000,
                            },
                        }}
                    />
                </AuthProvider>
            </ThemeProvider>
        </BrowserRouter>
    </StrictMode>
);