import { useState } from "react";

import type { FormEvent } from "react";
import type { AxiosError } from "axios";

import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext";

interface ErrorResponse {
    message?: string;
}

export default function LoginPage() {
    const [email, setEmail] = useState(
        "admin@test.com"
    );

    const [password, setPassword] = useState(
        "123456"
    );

    const [error, setError] = useState("");

    const [isLoading, setIsLoading] =
        useState(false);

    const { login } = useAuth();

    const navigate = useNavigate();

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ): Promise<void> => {
        event.preventDefault();

        setError("");

        if (!email.trim() || !password.trim()) {
            const message =
                "Email and password are required";

            setError(message);
            toast.error(message);

            return;
        }

        try {
            setIsLoading(true);

            await login(
                email.trim(),
                password
            );

            toast.success(
                "Login successful"
            );

            navigate("/dashboard");
        } catch (error) {
            const axiosError =
                error as AxiosError<ErrorResponse>;

            const message =
                axiosError.response?.data?.message ||
                "Unable to login";

            setError(message);

            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="login-page">
            <section className="login-card">
                <div className="login-header">
                    <div className="brand-icon">
                        ✓
                    </div>

                    <h1>Task Manager</h1>

                    <p>
                        Sign in to manage your daily
                        tasks
                    </p>
                </div>

                {error && (
                    <div className="alert alert-error">
                        {error}
                    </div>
                )}

                <form
                    className="login-form"
                    onSubmit={handleSubmit}
                >
                    <label>
                        Email address

                        <input
                            type="email"
                            value={email}
                            onChange={(event) =>
                                setEmail(
                                    event.target.value
                                )
                            }
                            placeholder="admin@test.com"
                            autoComplete="email"
                        />
                    </label>

                    <label>
                        Password

                        <input
                            type="password"
                            value={password}
                            onChange={(event) =>
                                setPassword(
                                    event.target.value
                                )
                            }
                            placeholder="Enter your password"
                            autoComplete="current-password"
                        />
                    </label>

                    <button
                        type="submit"
                        className="primary-button"
                        disabled={isLoading}
                    >
                        {isLoading
                            ? "Signing in..."
                            : "Sign in"}
                    </button>
                </form>

                <div className="demo-credentials">
                    <strong>
                        Demo credentials
                    </strong>

                    <span>
            Email: admin@test.com
          </span>

                    <span>
            Password: 123456
          </span>
                </div>
            </section>
        </main>
    );
}