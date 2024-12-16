import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import userModel from '../models/userModel.js'

export const register = async (req, res) => {
  const { name, email, password } = req.body
  if (!name || !email || !password) {
    return res.json({ success: false, message: "All fields are required" })
  }
  try {

    const existingUser = await userModel.findOne({ email })

    if (existingUser) {
      return res.json({ success: false, message: "User already exist" })
    }



    const hashPassword = await bcrypt.hash(password, 10)

    const user = new userModel({ name, email, password: hashPassword })

    await user.save()

    const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" })

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    })



    await transporter.sendMail(mailOptions)


    return res.json({ success: true })

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message })
  }
}


export const login = async (req, res) => {
  const { email, password } = req.body
  if (!email | !password) {
    return res.json({ success: false, message: "Email & password are required" })
  }

  try {
    const user = await userModel.findOne({ email })
    if (!user) {
      return res.json({ success: false, message: "user Dosn't exist" })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.json({ success: false, message: "Invalid password" })
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" })

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    })




    return res.json({ success: true })

  } catch (error) {
    return res.json({ success: false, message: error.message })
  }

}


export const logOut = async (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",

    })

    return res.json({ success: true, message: "Logout successfully" })

  } catch (error) {
    return res.json({ success: false, message: error.message })
  }
}



export const isAuthenticated = async (req, res) => {
  try {
    // Your logic to check authentication (e.g., verify a token)
    return res.status(200).json({ success: true, message: "Authenticated" });
  } catch (error) {
    console.error("Authentication Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// // send verification OTP to the user email
// export const sendVerifyOtp = async (req, res) => {
//   try {
//     const { userId } = req.body
//     const user = await userModel.findById(userId)
//     if (user.isAccountVerified) {
//       return res.json({ success: false, message: "Account already verified" })
//     }

//     const otp = String(Math.floor(100000 + Math.random() * 900000))


//     user.verifyOtp = otp
//     user.verifyOtpExpiresAt = Date.now() + 24 * 60 * 60 * 1000

//     await user.save()

//     const mailOption = {
//       from: process.env.SENDER_EMAIL,
//       to: user.email,
//       subject: 'Account verification OTP',
//       // text: `Your OTP is ${otp}. Verify your account using this OTP`,
//       html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email)
//     }

//     await transporter.sendMail(mailOption);

//     res.json({ success: true, message: "OTP sent successfully" })


//   } catch (error) {
//     res.json({ success: false, message: error.message })
//   }
// }


// export const verfiyEmail = async (req, res) => {
//   const { userId, otp } = req.body
//   if (!userId || !otp) {
//     return res.json({ success: false, message: "Missing Details" })
//   }
//   try {
//     const user = await userModel.findById(userId)
//     if (!user) {
//       return res.json({ success: false, message: "User not found" })
//     }

//     if (user.verifyOtp === "" || user.verifyOtp !== otp) {
//       return res.json({ success: false, message: "Invalid OTP" })
//     }

//     if (user.verifyOtpExpiresAt < Date.now()) {
//       return res.json({ success: false, message: "OTP Expired" })
//     }

//     user.isAccountVerified = true
//     user.verifyOtp = ""
//     user.verifyOtpExpiresAt = 0

//     await user.save()

//     res.json({ success: true, message: "Email Verified successfully" })

//   } catch (error) {
//     res.json({ success: false, message: error.message })
//   }
// }


// send password reset otp

// export const sendResetOtp = async (req, res) => {
//   const { email } = req.body
//   if (!email) {
//     return res.json({ success: false, message: "Email is required" })
//   }

//   try {
//     const user = await userModel.findOne({ email })

//     if (!user) {
//       return res.json({ success: false, message: "User not found" })
//     }

//     const otp = String(Math.floor(100000 + Math.random() * 900000))


//     user.resetOtp = otp
//     user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000

//     await user.save()

//     const mailOption = {
//       from: process.env.SENDER_EMAIL,
//       to: user.email,
//       subject: 'Password Reset OPT',
//       // text: `Your OTP for resetting your password is ${otp}. Use this otp to proceed with resetting your password`
//       html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email)
//     }

//     await transporter.sendMail(mailOption);

//     return res.json({ success: true, message: "OTP sent to your email" })

//   } catch (error) {
//     return res.json({ success: false, message: error.message })
//   }
// }


// // reset user password
// export const resetPassword = async (req, res) => {
//   const { email, newPassword, otp } = req.body
//   if (!email || !otp || !newPassword) {
//     return res.json({ success: true, message: "Email, OTP and newpassword are required" })
//   }

//   try {
//     const user = await userModel.findOne({ email })
//     if (!user) {
//       return res.json({ success: false, message: "User not found" })
//     }

//     if (user.resetOtp === "" || user.resetOtp !== otp) {
//       return res.json({ success: false, message: "Invalid OTP" })
//     }

//     if (user.resetOtpExpireAt < Date.now()) {
//       return res.json({ success: false, message: "OTP Expired" })
//     }

//     const hashedPassword = await bcrypt.hash(newPassword, 10)

//     user.password = hashedPassword
//     user.resetOtp = ""
//     user.resetOtpExpireAt = 0

//     await user.save();

//     res.json({ success: true, message: "Password has been resetted successfully" })


//   } catch (error) {
//     return res.json({ success: false, message: error.message })
//   }

// }


