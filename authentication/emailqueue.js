import { Queue } from "bullmq";
import dotenv from 'dotenv'
dotenv.config()
const connection = {host: process.env.redis_host, port:process.env.redis_port}
const emailQueue = new Queue('welcome-emails', { connection });
// sendwelcome email queu
 export async function sendWelcomeEmail(userData) {
    try{
        await emailQueue.add('send-email', {email:userData.email,name:userData.name}, {attempts:3,backoff:500});
        console.log(`✅ Job added for ${userData.email}`);
    }
    catch(err){
        console.log(err)
    }
}
//  reset password queue
export async function resetPassword(email,resetLink) {
    try{
        await emailQueue.add('reset-password', {email:email, link:resetLink})
         console.log(`✅ Job added for reset password on ${email}`);
    }
    catch(err){
        console.log(err)
    }
}