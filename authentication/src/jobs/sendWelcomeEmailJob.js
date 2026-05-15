import { transporter } from "../config/email.js";
import dotenv from 'dotenv'
dotenv.config()
import { welcomeTemplate } from "../emails/welcomeTemplate.js";
export const sendWelcomeEmail = async(data) =>{
    await transporter.sendMail({
        from:process.env.email_user,
        to:data.email,
        subject:"Welcome",
        html:welcomeTemplate(data.name)
    })
}