import {
    FiCheckSquare,
    FiLogOut,
    FiMoon,
    FiSun,
    FiUser,
} from "react-icons/fi";

import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();

    const navigate = useNavigate();

    const handleLogout = (): void => {
        logout();

        toast.success(
            "Logged out successfully"
        );

        navigate("/login");
    };

    return (
        <header className="navbar">
            <div className="navbar-container">
                <div className="navbar-brand">
                    <div className="navbar-logo">
                        <FiCheckSquare />
                    </div>

                    <div>
                        <h1>Task Manager</h1>

                        <span>
              Daily productivity workspace
            </span>
                    </div>
                </div>

                <div className="navbar-actions">
                    <button
                        type="button"
                        className="theme-button"
                        onClick={toggleTheme}
                        aria-label={
                            theme === "light"
                                ? "Enable dark mode"
                                : "Enable light mode"
                        }
                        title={
                            theme === "light"
                                ? "Dark mode"
                                : "Light mode"
                        }
                    >
                        {theme === "light" ? (
                            <FiMoon />
                        ) : (
                            <FiSun />
                        )}
                    </button>

                    <div className="user-profile">
                        <div className="user-avatar">
                            <FiUser />
                        </div>

                        <div className="user-details">
                            <strong>
                                {user?.name ||
                                    "Administrator"}
                            </strong>

                            <span>
                {user?.email ||
                    "admin@test.com"}
              </span>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="logout-button"
                        onClick={handleLogout}
                    >
                        <FiLogOut />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </header>
    );
}