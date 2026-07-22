import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const database = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3307,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

export const testDatabaseConnection =
    async (): Promise<void> => {
        try {
            const connection = await database.getConnection();

            console.log(
                "MySQL database connected successfully"
            );

            connection.release();
        } catch (error) {
            console.error(
                "Unable to connect to MySQL:",
                error
            );

            process.exit(1);
        }
    };

export default database;