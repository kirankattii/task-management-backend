import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import cookieParser from 'cookie-parser'
import connectDb from './config/mongoDb.js'
import authRouter from './routes/authRoutes.js'
import userRouter from './routes/userRoutes.js'
import taskRouter from './routes/taskRoutes.js'

const allowedOrigins = [
  "http://localhost:5173",
  "https://taskmanagement-frontend-seven.vercel.app"
]
const app = express()
const port = process.env.PORT || 4000
app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}))
connectDb()

app.get('/', (req, res) => {
  res.send("Api working")
})

// Add this middleware to set necessary headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,UPDATE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  next();
});
app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)
app.use('/api/task', taskRouter)


app.listen(port, () => {
  console.log(`server is running on ${port}`);
})


