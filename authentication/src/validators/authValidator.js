export const validateRegisterInput = (data) =>{
    if(!data.user_name || !data.email || !data.password){
        throw new Error('All fields required')
    }
    if (!data.email.includes("@") || !data.email.includes(".com")) {
        throw new Error('Invalid email format')
    }
    if (data.password.length < 8) {
        throw new Error("password is too short")
    }
}
export const validateLoginInput = (data) =>{
    if(!data.email || !data.password){
        throw new Error("Email and password required")
    }
    if(!data.email.includes('@') || !data.email.includes('.com')){
        throw new Error("Invalid email format")
    }
}