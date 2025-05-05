import * as dotenv from "dotenv";
dotenv.config();


export const Config = {
    databaseUrl: process.env.DATABASE_URI || "mongodb://127.0.0.1:27017",
    databaseName: process.env.DATABASE_NAME || "whatsapp",
    appPort: process.env.PORT || 5001,
    jwtSecret: process.env.JWT_SECRET,
    clientUrl: process.env.CLIENT_URL,
};
