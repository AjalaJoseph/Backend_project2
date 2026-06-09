import crypto from "crypto"
import { connection } from "../config/redis.js"
const STATIC_TTL = 60; // 30 seconds
const STATIC_PREFIX = 'idem';
export const idempotencyGuard = async(req, res, next) =>{
    if(req.method !=='POST' && req.method !=="PUT" && req.method !== "PATCH"){
        return next()
    }

        const payloadString = JSON.stringify(req.body, Object.keys(req.body).sort());
        
        const route = req.originalUrl;
    const bodyHash = crypto.createHash('sha256').update(`${route}:${payloadString}`).digest('hex');
    const redisKey = `${STATIC_PREFIX}:${bodyHash}`;
    
    try{

        // Change Step 1 from object syntax to sequential arguments:
        const lockAcquired = await connection.set(redisKey, 'PROCESSING', 'NX', 'EX', STATIC_TTL);
        console.log(lockAcquired)
        if(!lockAcquired){
            const currentValue = await connection.get(redisKey)
            console.log(currentValue)
            if (currentValue === 'PROCESSING') {
                return res.status(409).json({ 
                error: "Duplicate request detected. Processing is already underway." 
                });
            }

            if(currentValue){
                 const savedResponse = JSON.parse(currentValue);
                 return res.status(savedResponse.status).json(savedResponse.body);
            }
        }
         const originalJson = res.json;
                 res.json = async (body)=> {
            // Only cache successful mutations (200 OK, 201 Created)
            if (res.statusCode === 200 || res.statusCode === 201) {
                const cacheData = {
                status: res.statusCode,
                body: body
                };
                
            await connection.set(redisKey, JSON.stringify(cacheData), 'EX', STATIC_TTL)
             .catch(err => console.error('Failed to save idempotency cache:', err));
            } else {
                // If the DB threw an error, clear the lock so they can correct the input and retry
                await connection.del(redisKey).catch(err => console.error('Failed to clear lock on failure:', err));
            }

            return originalJson.call(res, body);
            };

            // Proceed forward to your database layer route handler safely
            return next();
    }
     catch (error) {
    console.error("Idempotency system error:", error);
   return  next(); // Fail open
  }
}