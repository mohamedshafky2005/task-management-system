import {
    createContext,
    useContext,
    useState,
} from "react";

import type { ReactNode } from "react";

import api from "../api/api";

import type { User } from "../types";

interface LoginResponse {
    success: boolean;
    message: string;
    data: {
        token: string;
        user: User;
    };
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (
        email: string,
        password: string
    ) => Promise<void>;
    logout: () => void;
}

const AuthContext =
    createContext<AuthContextType | undefined>(
        undefined
    );

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({
                                 children,
                             }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(
        () => {
            const storedUser =
                localStorage.getItem("user");

            if (!storedUser) {
                return null;
            }

            try {
                return JSON.parse(storedUser) as User;
            } catch {
                localStorage.removeItem("user");
                return null;
            }
        }
    );

    const login = async (
        email: string,
        password: string
    ): Promise<void> => {
        const response =
            await api.post<LoginResponse>(
                "/auth/login",
                {
                    email,
                    password,
                }
            );

        const { token, user: loggedInUser } =
            response.data.data;

        localStorage.setItem("token", token);

        localStorage.setItem(
            "user",
            JSON.stringify(loggedInUser)
        );

        setUser(loggedInUser);
    };

    const logout = (): void => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setUser(null);
    };

    const isAuthenticated = Boolean(
        localStorage.getItem("token")
    );

    const value: AuthContextType = {
        user,
        isAuthenticated,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
}