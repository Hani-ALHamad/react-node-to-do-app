const express = require('express')
const users = require('../models/users')
const router = new express.Router()
const jwt = require("jsonwebtoken")
const auth = require('../middleware/auth')

// ! used almost the same code from my User System App in users.js
// the backend part of checking if user is logged in (happens in auth) 
// and updates the user data in frontend whenever its needed
router.get("/logincheck", auth, (req, res) => {
  if (req.user.avatar) {
    var avatar = req.user.avatar.toString('base64')
  }
  res.send({
    username: req.user.username,
    avatar: avatar
  })
})

// backend part of signing user in, it will make a new token and attach it to the user in the DB
// it does make the HttpOnly cookie too
router.post("/usersignin", async (req, res) => {
  try {
    const user = await users.findAndVerifyUser(req.body.username, req.body.password)
    const token = await user.generateAuthToken()

    res.cookie("secureToken", token, {
      secure: process.env.NODE_ENV !== "development",
      httpOnly: true,
      sameSite: 'strict'
    });

    res.send({ user, token })
  }
  catch (e) {
    res.status(400).send(e)
  }
})

// to logout the user, it does remove the HttpOnly token cookie from the DB as well
router.get("/logout", auth, async (req, res) => {
  try {
    const decoded = jwt.verify(req.cookies.secureToken, process.env.JWT_SECRET_TOKEN)
    const user = await users.findOne({ _id: decoded._id, 'tokens.token': req.cookies.secureToken })
    const temp = user.tokens.filter((item) => item.token !== req.cookies.secureToken)
    user.tokens = temp
    await user.save()
    res.send()
  } catch (e) {
    res.status(404).send()
  }
})

module.exports = router