import { validateRegisterInput } from "../validators/authValidator.js";
import bcrypt from 'bcrypt'
import { emailQueue } from "../queues/emailQueue.js";
import { generateToken, generateRefreshToken } from "../utils/generateToken.js";
import { findUserByEmail, createUser } from "../models/authModele.js";
export const registerUser = async(data) =>{
    //  check if email exist
    const userExist = await findUserByEmail(data.email)
    if(userExist){
        throw new Error("Email already exists")
    }
    // hash password
    const hash_password = await bcrypt.hash(data.password, 10)
    // insert user into the database
    const userInsert = await createUser(data.user_name, data.email, hash_password);
    // add job to queue
    await emailQueue.add('send-email', {
        email:data.email,
        name:data.user_name
    })
   
}
export const loginUser = async(data) =>{
    const user = await findUserByEmail(data.email)
    if(!user){
        throw new Error("Invalid credential")
    }
    const isMatch = await bcrypt.compare(data.password, user.password)
    if(!isMatch){
        throw new Error("Invalid password")
    }
    const token = await generateToken(user)
    const refreshToken = await generateRefreshToken(user)
    delete user.password
    return {
        user,
         token,
        refreshToken
    }
}