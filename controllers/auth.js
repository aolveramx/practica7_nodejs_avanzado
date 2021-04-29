const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const User = require('../models/User')

/**
 * @desc   Register user
 * @route  POST /api/v1/auth/register
 * @access Public
 */
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body

  //Create User
  const user = await User.create({
    name,
    email,
    password
  })

  //Create Token
  const token = user.getSignedJwtToken()

  res.status(200).json({ success: true, token })
})