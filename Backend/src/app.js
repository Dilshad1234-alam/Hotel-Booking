import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRouter from './routes/auth.routes.js'
import adminRouter from './routes/admin.routes.js'
import hotelRouter from './routes/hotel.routers.js'
import roomRouter  from './routes/room.routes.js'
import paymentRouter from "./routes/payment.routes.js";
import reviewRouter from "./routes/review.routes.js";
import bookingRouter from "./routes/booking.routes.js";
import uploadRouter from "./routes/upload.routes.js"


const app = express()

app.use(express.json())
app.use(cookieParser())

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))

app.use("/api/upload", uploadRouter)


app.use("/api/auth", authRouter)
app.use("/api/admin", adminRouter)
app.use("/api/admin/bookings", bookingRouter)
app.use("/api/admin/payments", paymentRouter)
app.use("/api/admin/reviews", reviewRouter)
app.use("/api/hotels", hotelRouter)
app.use("/api/rooms", roomRouter)



export default app