const users = require('../models/users')
const jwt = require('jsonwebtoken')

// ! used almost the same code from my User System App in auth.js
const auth = async (req, res, next) => {
  try {
    // first the jwt will verify if the token is expired
    // if expired then it will be deleted from the database
    const decoded = jwt.verify(req.cookies.secureToken, process.env.JWT_SECRET_TOKEN, async function (error, data) {
      if (error) {
        if (error.name === "TokenExpiredError") {
          const user = await users.findOne({ _id: decoded._id, 'tokens.token': req.cookies.secureToken })
          const temp = user.tokens.filter((item) => item.token !== req.cookies.secureToken)
          user.tokens = temp
          await user.save()
          return error
        }
      }
      // if not expired then it will return the decoded value
      return data
    })
    // used await to turn the promise into an object
    const decodedData = await decoded
    // after making sure that the token is valid and not expired it will search for the user that have this token 
    const user = await users.findOne({ _id: await decodedData._id, 'tokens.token': req.cookies.secureToken })
    // if the token is attached to a user in the database then it will return "authorized"
    if (!user) {
      throw new Error()
    }

    req.user = user

    next()
  } catch (e) {
    res.status(401).send(e)
  }
}

module.exports = auth