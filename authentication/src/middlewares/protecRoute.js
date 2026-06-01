import jwt from "jsonwebtoken"
import dotenv from 'dotenv'
dotenv.config()
export const protectUser = async (req, res, next) =>{
    try{
       const authHeader =await req.headers.authorization;
       if(!authHeader || !authHeader.startsWith('Bearer ')){
         return res.status(401).json({ 
            status: 'error',
            message: 'Access Denied: Access token missing or invalid format' 
         });
       }
       const token = authHeader.split(' ')[1]
       const payload = jwt.verify(token, process.env.JWT_SCRETE)
       req.user= payload
      return next()
    }
    catch(error){
       if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                status: 'error',
                code: 'ACCESS_TOKEN_EXPIRED', // This specific code tells the frontend exactly what happened
                message: 'Your access token has expired. Please refresh your session.'
            });
        }
         return res.status(403).json({
        status:'error',
        message :'Access Denied: Invalid security token'
    })
    }

   
}