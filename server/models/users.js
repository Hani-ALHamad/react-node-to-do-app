const mongoose = require('mongoose')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

// ! used almost the same code from my User System App in users.js
// the schema for the user model
const usersSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 18,
    lowercase: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    trim: true,
  },
  tokens: [{
    token: {
      type: String,
      required: true,
    }
  }],
  avatar: {
    type: Buffer
  }
}, {
  timestamps: true
})

// for making json web tokens
usersSchema.methods.generateAuthToken = async function () {
  const thisUser = this
  const token = jwt.sign({ _id: thisUser._id.toString() }, process.env.JWT_SECRET_TOKEN, { expiresIn: "30d" })
  thisUser.tokens = thisUser.tokens.concat({ token })
  await thisUser.save()
  return token
}

// for verifying password when logging in
usersSchema.statics.findAndVerifyUser = async (username, password) => {
  const user = await users.findOne({ username: username })

  if (!user) {
    throw new Error("Wrong username or password")
  }
  if (!await bcryptjs.compare(password, user.password)) {
    throw new Error("Wrong username or password")
  }

  return user
}

const users = mongoose.model('users', usersSchema)

module.exports = users
