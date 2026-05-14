import { Queue } from "bullmq";
import dotenv from 'dotenv'
dotenv.config()
const connection = {host: process.env.redis_host, port:process.env.redis_port}
const emailQueue = new Queue('welcome-emails', { connection });
 export async function sendWelcomeEmail(userData) {
    try{
        await emailQueue.add('send-email', {email:userData.email,name:userData.name}, {attempts:3,backoff:500});
        console.log(`✅ Job added for ${userData.email}`);
    }
    catch(err){
        console.log(err)
    }
}
