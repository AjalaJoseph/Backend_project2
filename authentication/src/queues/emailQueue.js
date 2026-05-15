import { Queue } from "bullmq";
import { connection } from "../config/redis.js";
export const emailQueue = new Queue('welcome-emails', { connection });