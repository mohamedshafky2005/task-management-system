import dotenv from "dotenv";
import app from "./app";
import {
    testDatabaseConnection,
} from "./config/database";

dotenv.config();

const port = Number(process.env.PORT) || 5000;

const startServer = async (): Promise<void> => {
    try {
        await testDatabaseConnection();

        app.listen(port, () => {
            console.log(
                `Server is running on http://localhost:${port}`
            );
        });
    } catch (error) {
        console.error(
            "Failed to start the server:",
            error
        );

        process.exit(1);
    }
};

startServer();