import { Pool } from 'pg';
import dotenv from 'dotenv'
dotenv.config()
export const dbPool = new Pool({
    user: process.env.postgres_userName,
    host: 'localhost',
    database: 'user_db',
    password: process.env.postgres_password,
    port: process.env.postgresPort,
});