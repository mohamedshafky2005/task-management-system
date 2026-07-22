"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = __importDefault(require("../config/database"));
const login = async (request, response) => {
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
        const [rows] = await database_1.default.execute(`
      SELECT id, name, email, password
      FROM users
      WHERE LOWER(email) = ?
      LIMIT 1
      `, [normalizedEmail]);
        const users = rows;
        if (users.length === 0) {
            response.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
            return;
        }
        const user = users[0];
        const passwordMatches = await bcryptjs_1.default.compare(String(password), String(user.password).trim());
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
        const token = jsonwebtoken_1.default.sign({
            userId: user.id,
            email: user.email,
        }, jwtSecret, {
            expiresIn: "1d",
        });
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
    }
    catch (error) {
        console.error("Login error:", error);
        response.status(500).json({
            success: false,
            message: "An error occurred while logging in",
        });
    }
};
exports.login = login;
//# sourceMappingURL=authController.js.map