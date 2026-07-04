import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
    {
        fullname: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true 
        },
        password: {
            type: String,
            required: true 
        },
        contact: {
            type: String,
            required: false
        },
        address: {
            type: String,
            default: ""
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user"
        },
        googleId: {
            type: String,
        }
    },
    { timestamps: true }
)

const userModel = mongoose.model('user', userSchema)

export default userModel