import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
export const generateToken = (user)=>{
    const pay_load ={
        userId: user.id, 
        email: user.email 
    }
    return jwt.sign(
        pay_load, process.env.JWT_SCRETE, {expiresIn:"1m"}
    )
}
export const generateRefreshToken = (user) =>{
   const pay_load ={
        userId: user.id, 
        email: user.email 
    }
    return jwt.sign(pay_load, process.env.REFRESH_TOKEN_SECRET, {expiresIn:'7d'})
}
// generate new token 
export const generateNewAccessToken = (data) =>{
    const payLoad ={
        userId : data.verify.userId,
        email:data.verify.email
    }

     return jwt.sign(
        payLoad, process.env.JWT_SCRETE, {expiresIn:"1m"}
    )
}