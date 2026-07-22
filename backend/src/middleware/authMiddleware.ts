import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest } from "../types/express";

interface JwtPayload {
    userId: number;
    email: string;
}

export const authenticate = (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction
): void => {
    try {
        const authorizationHeader = request.headers.authorization;

        if (
            !authorizationHeader ||
            !authorizationHeader.startsWith("Bearer ")
        ) {
            response.status(401).json({
                success: false,
                message: "Authentication token is required",
            });
            return;
        }

        const token = authorizationHeader.split(" ")[1];

        if (!token) {
            response.status(401).json({
                success: false,
                message: "Authentication token is required",
            });
            return;
        }

        const jwtSecret = process.env.JWT_SECRET;

        if (!jwtSecret) {
            throw new Error("JWT_SECRET is not configured");
        }

        const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

        request.user = {
            userId: decoded.userId,
            email: decoded.email,
        };

        next();
    } catch (error) {
        response.status(401).json({
            success: false,
            message: "Invalid or expired authentication token",
        });
    }
};