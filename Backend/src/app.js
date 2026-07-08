import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRouter from './routes/auth/auth.routes.js'
import adminRouter from './routes/admin/admin.routes.js'
import hotelRouter from './routes/admin/hotel.routers.js'
import roomRouter  from './routes/admin/room.routes.js'
import paymentRouter from "./routes/admin/payment.routes.js";
import reviewRouter from "./routes/admin/review.routes.js";
import bookingRouter from "./routes/admin/booking.routes.js";
import userRouter from "./routes/user/user.routes.js"
import userPaymentRouter from "./routes/user/payment.routes.js"


const app = express()

app.use(express.json())
app.use(cookieParser())

app.use(cors({
    origin: [
        "http://localhost:5173",
        process.env.FRONTEND_URL
    ],
    credentials: true,
}))

app.use("/api/auth", authRouter)
app.use("/api/admin", adminRouter)
app.use("/api/admin/bookings", bookingRouter)
app.use("/api/admin/payments", paymentRouter)
app.use("/api/admin/reviews", reviewRouter)
app.use("/api/hotels", hotelRouter)
app.use("/api/rooms", roomRouter)

app.use("/api/user", userRouter)
app.use("/api/user/payment", userPaymentRouter)


export default app