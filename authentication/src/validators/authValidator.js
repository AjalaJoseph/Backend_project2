import dotenv from 'dotenv';
import jwt from 'jsonwebtoken'
dotenv.config()
export const validateRegisterInput = (data) =>{
    if(!data.user_name || !data.email || !data.password){
        throw new Error('All fields required')
    }
    if (!data.email.includes("@") || !data.email.includes(".com")) {
        throw new Error('Invalid email format')
    }
    if (data.password.length < 8) {
        throw new Error("password is too short")
    }
}
// login data validate
export const validateLoginInput = (data) =>{
    if(!data.email || !data.password){
        throw new Error("Email and password required")
    }
    if(!data.email.includes('@') || !data.email.includes('.com')){
        throw new Error("Invalid email format")
    }
}

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