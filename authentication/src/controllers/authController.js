import { validateRegisterInput, validateLoginInput,  validateToken, validateLogout } from "../validators/authValidator.js";
import { registerUser, loginUser } from "../services/authService.js";
import { connection } from "../config/redis.js";
import { generateNewRefreshToken } from "../utils/generateToken.js";
export const registerControl= async(req, res)=>{
    try{
        // validate input
        const data = req.body
        
        await validateRegisterInput(data)
        // register user 
        await registerUser(data);
       return  res.status(201).json({message:"User created"})
    }
    catch(err){
       return  res.status(400).json({error:err. message})
        console.log(err.message)
    }
}
// login controller
export const loginControler = async(req, res)=>{
    try{
        // validate userlogin  input 
        await validateLoginInput(req.body)
        //  login user 
        const result = await loginUser(req.body)
        // set user refresh token to redis
         await connection.set(`refresh:${result.id}`, result.refreshToken)
        //   store token inside cookie
         res.cookie('refreshToken', result.refreshToken, {
                httpOnly: true,
                sameSite: 'Strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
            });
       return res.status(200).json({
            message:"login successfull",
            data:{
                user:result.user,
                accessToken:result.token
            }
        })
    }
    catch(err){
        return res.status(400).json({
            error:err.message
        })
    }
}

// refresh token controller
export const refreshController = async(req, res) =>{
    try{
        const refreshToken = await req.cookies.refreshToken
    const lastToken = await validateToken(refreshToken)
    const newRefreshToken = await generateNewRefreshToken(lastToken)
       return res.status(200).json({message:'New access token generated', newRefreshToken})
    }
    catch(err){
       return res.status(401).json({error:err.message})
    }
}

// logout controller

export const logoutController = async (req, res)=>{
    try{
        const token = await req.cookies.refreshToken
        const logout = await validateLogout(token)
        const userId = logout.userId
        await connection.del(`refresh:${userId}`)
        res.clearCookie('refreshToken')
        return res.status(200).json({ message: "Logged out successfully" });
    }
    catch(error){
         res.clearCookie('refreshToken');
        return res.status(200).json({ message: error.message });
    }
}