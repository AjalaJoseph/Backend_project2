import { Worker } from "bullmq";
import { connection } from "../config/redis.js";
import { sendWelcomeEmail } from "../jobs/sendWelcomeEmailJob.js";
export const worker = new Worker('welcome-emails',async (job) =>{
    switch(job.name){
      case 'send-email':{
        await sendWelcomeEmail(job.data)
        break;
      }
      default:
        console.log("unknow job name")
    }
}, {connection})