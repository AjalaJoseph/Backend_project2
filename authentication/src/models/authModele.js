import { dbPool } from "../config/database.js";
export const findUserByEmail = async(email) =>{
    const result = await dbPool.query(`SELECT * FROM user_data WHERE email = $1`, [email])
    return result.rows[0]
}
export const createUser = async (user_name, email, password)=>{
    const role = (email === "ajalaoluwafikayomi27@gmail.com") ? "admin" : "user";
    const result = await dbPool.query(
             'INSERT INTO user_data(user_name, email, password, role) VALUES($1, $2, $3, $4)',
            [user_name, email, password, role]
        )
        return result.rows[0]
}