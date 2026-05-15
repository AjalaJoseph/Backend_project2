import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
export const generateToken = (user)=>{
    const pay_load ={
        userId: user.id, 
        email: user.email 
    }
    return jwt.sign(
        pay_load, process.env.JWT_SCRETE, {expiresIn:"5m"}
    )
}
export const generateRefreshToken = (user) =>{
   const pay_load ={
        userId: user.id, 
        email: user.email 
    }
    return jwt.sign(pay_load, process.env.REFRESH_TOKEN_SECRET, {expiresIn:'1d'})
}