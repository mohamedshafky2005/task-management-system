import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import database from "../config/database";

interface UserRow {
    id: number;
    name: string;
    email: string;
    password: string;
}

export const login = async (
    request: Request,
    response: Response
): Promise<void> => {
    try {
        const { email, password } = request.body;

        if (!email || !password) {
            response.status(400).json({
                success: false,
                message: "Email and password are required",
            });
            return;
        }

        const normalizedEmail = String(email).trim().toLowerCase();

        const [rows] = await database.execute(
            `
      SELECT id, name, email, password
      FROM users
      WHERE LOWER(email) = ?
      LIMIT 1
      `,
            [normalizedEmail]
        );

        const users = rows as UserRow[];

        if (users.length === 0) {
            response.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
            return;
        }

        const user = users[0];

        const passwordMatches = await bcrypt.compare(
            String(password),
            String(user.password).trim()
        );

        if (!passwordMatches) {
            response.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
            return;
        }

        const jwtSecret = process.env.JWT_SECRET;

        if (!jwtSecret) {
            throw new Error("JWT_SECRET is not configured");
        }

        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email,
            },
            jwtSecret,
            {
                expiresIn: "1d",
            }
        );

        response.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                },
            },
        });
    } catch (error) {
        console.error("Login error:", error);

        response.status(500).json({
            success: false,
            message: "An error occurred while logging in",
        });
    }
};