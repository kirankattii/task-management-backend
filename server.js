import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import cookieParser from 'cookie-parser'
import connectDb from './config/mongoDb.js'
import authRouter from './routes/authRoutes.js'
import userRouter from './routes/userRoutes.js'
import taskRouter from './routes/taskRoutes.js'

const allowedOrigins = ["http://localhost:5173", "https://taskmanagement-frontend-seven.vercel.app"]
const app = express()
const port = process.env.PORT || 4000
app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}))
connectDb()

app.get('/', (req, res) => {
  res.send("Api working")
})
app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)
app.use('/api/task', taskRouter)


app.listen(port, () => {
  console.log(`server is running on ${port}`);
})


