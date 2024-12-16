import mongoose, { mongo } from 'mongoose'

const userSchema = new mongoose.Schema({
  name: {
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
    required: true,
  },

})


const userModel = mongoose.model.user || mongoose.model("user", userSchema)

export default userModel