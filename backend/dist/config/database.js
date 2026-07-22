"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testDatabaseConnection = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const database = promise_1.default.createPool({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3307,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});
const testDatabaseConnection = async () => {
    try {
        const connection = await database.getConnection();
        console.log("MySQL database connected successfully");
        connection.release();
    }
    catch (error) {
        console.error("Unable to connect to MySQL:", error);
        process.exit(1);
    }
};
exports.testDatabaseConnection = testDatabaseConnection;
exports.default = database;
//# sourceMappingURL=database.js.map