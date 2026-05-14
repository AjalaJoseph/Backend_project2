
import express from 'express'
import { Pool } from 'pg';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import Redis from 'ioredis';
import cookieParser from 'cookie-parser';
import { sendWelcomeEmail } from './emailqueue.js';
dotenv.config();
const app = express();

const client = new Redis({
    host:process.env.redis_host,
    port:process.env.redis_port
})
// Middleware
app.use(express.json());
app.use(cookieParser()); 

const JWT_SECRET = process.env.JWT_SCRETE;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

const pool = new Pool({
    user: process.env.postgres_userName,
    host: 'localhost',
    database: 'user_db',
    password: process.env.postgres_password,
    port: process.env.postgresPort,
});

// --- ROUTES ---

// 1. REGISTER
app.post('/register', async (req, res) => {
    try {
        const { email, user_name, password } = req.body;

        if (!email || !user_name || !password) {
            return res.status(400).json({ status: "fail", message: "all fields are required" });
        }
        if (!email.includes("@") || !email.includes(".com")) {
            return res.status(400).json({ error: "Invalid email format" });
        }
        if (password.length < 8) {
            return res.status(400).json({ error: "password must be greater than 8 characters" });
        }

        const exists = await pool.query(`SELECT * FROM user_data WHERE email = $1`, [email]);
        if (exists.rows.length > 0) {
            return res.status(400).json({ error: "User already exists" });
        }

        const role = (email === "ajalaoluwafikayomi27@gmail.com") ? "admin" : "user";
        const hash_password = await bcrypt.hash(password, 10);

        await pool.query(
            'INSERT INTO user_data(user_name, email, password, role) VALUES($1, $2, $3, $4)',
            [user_name, email, hash_password, role]
        );
        await sendWelcomeEmail({email:email, name:user_name})
        res.status(200).json({ status: "success", message: "account created successfully check your email for account verification" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "internal server error" });
    }
});

// 2. LOGIN
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const result = await pool.query('SELECT * FROM user_data WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const payload = { userId: user.id, email: user.email };
            const access_token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
            const refresh_token = jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: '3d' });

            await client.set(`refresh:${user.id}`, refresh_token)
           
            res.cookie('refreshToken', refresh_token, {
                httpOnly: true,
                sameSite: 'Strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
            });
             
            return res.json({
                message: "Login Successful",
                user: { user_name: user.user_name, email: user.email },
                token: access_token,
            });
        } else {
            return res.status(400).json({ error: "Invalid credentials" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "internal server error" });
    }
});

// 3. REFRESH TOKEN
app.post('/refresh', async (req, res) => {
    
    const refresh_Token = req.cookies.refreshToken;
    if (!refresh_Token) {
        return res.status(401).json({ error: "Refresh token is invalid" });
    }
    const decoded = jwt.verify(refresh_Token, REFRESH_TOKEN_SECRET)
    const user_id = decoded.userId
    const user_email = decoded.email
    const storeToken = await client.get(`refresh:${user_id}`)
    if(!storeToken || storeToken!== refresh_Token){
       return  res.status(403).json({error:"Session expired or revoked. Please login again."})
    }
    const pay_load = { userId: user_id, email: user_email };
     const newAccessToken = jwt.sign(pay_load, JWT_SECRET, { expiresIn: "1h" });
     return res.json({ message: newAccessToken });
    
});

// logout route
app.post("/logout", async (req, res) =>{
    try{
        const refresh_token = await req.cookies.refreshToken
        const verify = jwt.verify(refresh_token, REFRESH_TOKEN_SECRET)
        if(!verif){
           return res.status(204).json({error:"no token available nothing to deleted"})
        }

        const userId = verify.userId
        await client.del(`refresh:${userId}`)
        res.clearCookie('refreshToken')
        return res.status(200).json({ message: "Logged out successfully" });
    }
    catch(error){
         res.clearCookie('refreshToken');
        return res.status(200).json({ message: "Session cleared" });
    }
})
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Express server running at http://localhost:${PORT}/`));
