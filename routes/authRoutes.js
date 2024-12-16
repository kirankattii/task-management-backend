import express from "express";
import { isAuthenticated, login, logOut, register, } from "../controllers/authController.js";
import userAuth from "../middleware/userAuth.js";

const authRouter = express.Router()

authRouter.post('/register', register)
authRouter.post('/login', login)
authRouter.post('/logout', logOut)
authRouter.get('/is-auth', userAuth, isAuthenticated)


export default authRouter