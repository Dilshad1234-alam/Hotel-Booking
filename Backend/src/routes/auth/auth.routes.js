import express from 'express'
import { getMe, login, logout, register } from '../../controllers/auth/auth.controller.js'
import { authenticateuser } from '../../middleware/auth/auth.middleware.js'
import { validateLoginUser, validateRegisterUser } from '../../validator/auth/auth.validator.js'


const router = express.Router()

// api/auth/register
router.post("/register", validateRegisterUser, register)

// api/auth/login
router.post("/login", validateLoginUser, login)

// api/auth/me
router.get("/me", authenticateuser, getMe)

// api/auth/logout
router.get("/logout", authenticateuser, logout)


export default router;