import bcrypt from 'bcrypt'
import userModel from "../../models/auth/user.model.js";
import jwt from 'jsonwebtoken'
import { config } from '../../config/config.js';

async function sendTokenResponse(user, res, message) {
    
    const token = jwt.sign({
        id: user._id,
    }, config.JWT_SECRET, {
        expiresIn: "7d"
    })

    res.cookie("token", token, {
        httpOnly: true,
        secure: config.NODE_ENV === "production",
        sameSite: config.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
        message,
        success: true,
        user: {
            id: user._id,
            email: user.email,
            contact: user.contact,
            fullname: user.fullname,
            role: user.role
        }
    })
}


export const register = async (req, res) => {

    const { fullname, email, password, contact, address, role } = req.body 

    try {
        const existingUser = await userModel.findOne({
            $or: [
                { email },
                { contact }
            ]
        })

        if (existingUser) {
            return res.status(404).json({
                message: "User with this email or contact already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await userModel.create({
            fullname,
            email,
            password: hashedPassword,
            contact,
            address,
            role: role || "user"
        });

        return sendTokenResponse(user, res, "User registered successfully")

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        });
    }

};


export const login = async (req, res) => {
    const { email, password } = req.body 

    try{
  
        const user = await userModel.findOne({ email })
        
        if (!user) {
            return res.status(400).json({
                message: "Invaild email or password"
            })
        }
        
        const isPasswordMatch = await bcrypt.compare(password, user.password)
        
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Invalid email or password",
                success: false
            })
        }
        
        return sendTokenResponse(user, res, "Login Successfully")

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
    
}


export const getMe = async (req, res) => {
    const user = req.user

    try{

        res.status(200).json({
            message: "user fetched successfully",
            success: true,
            user: req.user
        })
        
    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        })
   }

}


export const logout = async (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
        sameSite: config.NODE_ENV === "production" ? "none" : "lax",
        secure: config.NODE_ENV === "production"
    })
    
    res.status(200).json({
        message: "Logged out successfully",
        success: true
    })
}    