"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticate = (request, response, next) => {
    try {
        const authorizationHeader = request.headers.authorization;
        if (!authorizationHeader ||
            !authorizationHeader.startsWith("Bearer ")) {
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
        const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
        request.user = {
            userId: decoded.userId,
            email: decoded.email,
        };
        next();
    }
    catch (error) {
        response.status(401).json({
            success: false,
            message: "Invalid or expired authentication token",
        });
    }
};
exports.authenticate = authenticate;
