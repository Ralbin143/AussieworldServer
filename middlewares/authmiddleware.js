const User = require('../models/User')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

const authMiddleware = asyncHandler(async (req, res, next) => {
    let token;
    if (req?.headers?.authorization?.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1]
        try {
            if (token) {
                const decoded = jwt.verify(token, process.env.JWT_SECRET)
                const user = await User.findById(decoded?.id)
                req.user = user
                next()
            }
        } catch (error) {
            throw new Error("Not authorised, token expired. Please login again")
        }
    }

    next()
})

const isAdminMiddleware = asyncHandler(async(req,res,next)=>{
    const userRole = req.body.role;

    if (userRole !== "Admin") {
      return res.status(403).json({ message: 'Permission denied. Only admins allowed.' });
    }
  
    next();
})

module.exports = { authMiddleware ,isAdminMiddleware }