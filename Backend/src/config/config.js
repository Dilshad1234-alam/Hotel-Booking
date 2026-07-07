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
    IMAGEKIT_PUBLIC_KEY:process.env.IMAGEKIT_PUBLIC_KEY,
    IMAGEKIT_PRIVATE_KEY:process.env.IMAGEKIT_PRIVATE_KEY,
    IMAGEKIT_URL_ENDPOINT:process.env.IMAGEKIT_URL_ENDPOINT,
}

