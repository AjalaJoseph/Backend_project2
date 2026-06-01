import dotenv from 'dotenv';
import jwt from 'jsonwebtoken'
import { body, validationResult} from "express-validator"
dotenv.config()
export const validateRegisterInput = [
    // validate and sanitize user_name
    body('user_name')
    .trim()
    .notEmpty().withMessage('username is require')
    .isLength({min:4}).withMessage('Username must be at least 4 characters long'),

    //  validate and sanitize email
    body('email')
    .trim()
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),

    // validate password
    body('password')
    .trim()
    .isStrongPassword().withMessage('Password must contain atleast 1 uppercase, 1 lowercase, 1 number, 1, special characters and must be atleast 8 character.'),

]

export const validate =(req, res, next) =>{
    const error = validationResult(req)
    if(!error.isEmpty()){
        const errormessage = error.array().map(err => err.msg)
        return res.status(400).json({error:errormessage})
    }
    next()
}
// export const validateRegisterInput = (data) =>{
//     if(!data.user_name || !data.email || !data.password){
//         throw new Error('All fields required')
//     }
//     if (!data.email.includes("@") || !data.email.includes(".com")) {
//         throw new Error('Invalid email format')
//     }
//     if (data.password.length < 8) {
//         throw new Error("password is too short")
//     }
// }
// login data validate
export const validateLoginInput =[
    // validate and sanitize email
    body('email')
    .trim()
    .notEmpty().withMessage('Email is require')
    .isEmail().withMessage('Enter a valid email ')
    .normalizeEmail(),

    //  validate password input
    body('password')
    .trim()
    .notEmpty().withMessage('password is require')
]

export const validateLogin = (req, res, next) =>{
    const error = validationResult(req)
    if(!error.isEmpty()){
        const errormessage = error.array().map(err => err.msg)
        return res.status(400).json({error:errormessage})
    }
    next()
}

//  change password route
export const validatePasswordInput = [
    body('old_password')
    .trim()
    .notEmpty().withMessage('old password field is require'),

    body('new_password')
    .trim()
    .notEmpty().withMessage('new password field is require')
    .isStrongPassword().withMessage('Password must contain atleast 1 uppercase, 1 lowercase, 1 number, 1, special characters and must be atleast 8 character.'),
]

export const validatePassword = async (req, res, next) =>{
    const error = validationResult(req)
    if(!error.isEmpty()){
        const errormessage = error.array().map(err => err.msg)
        return res.status(400).json({error:errormessage})
    }
}
// export const validateLoginInput = (data) =>{
//     if(!data.email || !data.password){
//         throw new Error("Email and password required")
//     }
//     if(!data.email.includes('@') || !data.email.includes('.com')){
//         throw new Error("Invalid email format")
//     }
// }

// token validator
export const validateToken = (data) =>{
    if(!data){
        throw new Error("No refresh token")
    }
    const verify = jwt.verify(data, process.env.REFRESH_TOKEN_SECRET)
    if(!verify){
        throw new Error('invalid or expired refresh token')
    }
    return{
        verify
    }
}

// logout validator
export const validateLogout = (token)=>{
    const verifyToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)
    if(!verifyToken){
           return res.status(204).json({error:"no token available nothing to deleted"})
        }
        return verifyToken
}