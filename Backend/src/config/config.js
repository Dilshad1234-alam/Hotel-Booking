import dotenv from 'dotenv'
dotenv.config()

if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not define is enviroment variable")
}

if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not define is enviroment variable")
}




export const config = {
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    NODE_ENV: process.env.NODE_ENV || production,
}

