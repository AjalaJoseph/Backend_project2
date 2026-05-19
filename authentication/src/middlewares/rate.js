import ratelimite from 'express-rate-limit'
export const limiter = ratelimite({
    windowMs:15 * 60 * 1000,
    limit:5,
    message: 'Too many login attempts, please try again after an hour',
})