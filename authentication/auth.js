const http = require('http')
const {Pool}= require('pg')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv')
const { error } = require('console');
dotenv.config()
const JWT_SCRETE =process.env.JWT_SCRETE ;
const  refreshToken= process.env.REFRESH_TOKEN_SECRET;

console.log( process.env.REFRESH_TOKEN_SECRET)
const pool = new Pool({
  user: process.env.postgres_userName,
  host: 'localhost',
  database: 'user_db',
  password: process.env.postgres_password,
  port: process.env.postgresPort, // Default PostgreSQL port
});
const getBody = (request) =>{
  return new Promise((resolve, reject) =>{
    let body ='';
    request.on('data', chunk=>body+=chunk.toString());
    request.on('end', ()=> resolve(JSON.parse(body)))
  })
}

 const server = http.createServer(async (req, res) =>{
      res.setHeader('Content-Type', 'application/json');
       try{
        if(req.url ==="/register" && req.method==="POST"){
          const data = await getBody(req)
          const {email, user_name, password} = data
          if(!email || !user_name || !password){
            res.writeHead(400)
            res.end(JSON.stringify({status:"fail", message:"all fiels are required"}))
            
          }
            if(!email.includes("@") || !email.includes(".com")){
              res.writeHead(400)
            return res.end(JSON.stringify({error:"Invalid email format"}))
            }
            if(password.length<8){
              res.writeHead(400)
           return  res.end(JSON.stringify({error:"password must greater  than 8 character"}))
            
            }
            const exists = await pool.query(`SELECT * FROM user_data WHERE email = $1`,[email]);
           if(exists.rows.length >0){
            res.writeHead(400)
            return res.end(JSON.stringify({error:"User already exists"}))
           }
             const hash_password = await bcrypt.hash(password,10)
            const query = 'INSERT INTO user_data(user_name, email, password) VALUES($1, $2, $3)';
            const values = [user_name, email, hash_password];
            await pool.query(query, values);
            
          res.writeHead(200)
          return res.end(JSON.stringify({ status: "success", message: "account created successful" }));
            // }
            
          }
          
        else if(req.url==="/login" && req.method==="POST" ){
          const data = await getBody(req)
          const {email, password} = data
          if(!email || !password){
            res.writeHead(400)
            res.end(JSON.stringify({error: "All fields are required"}))
          }
          else{
            const query = 'SELECT * FROM user_data WHERE email = $1';
            const result = await pool.query(query, [email]);
            if(result.rows.length ===0){
              res.writeHead(401)
              return res.end(JSON.stringify({error:"Invalid email or password"}))
            }
            else{
             const user = result.rows[0]
            const isMatch = await bcrypt.compare(password, user.password)
            if(isMatch){
              const payload = {userId : user.id,email:user.email}
               const access_token = jwt.sign(payload, JWT_SCRETE, { expiresIn: '1h' })
               const refresh_token = jwt.sign(payload,refreshToken,{expiresIn: '3d'})
              res.writeHead(200,{'content-type':'application/json', 'set-cookie':
                `refreshToken=${refresh_token}; HttpOnly; SameSite=Strict; Max-Age=${7 * 24 * 60 * 60}; Path=/`,
                })
              return res.end(JSON.stringify({message: "Login Successful", 
                user:{user_name:user.user_name, email:user.email},
                token:access_token
              }))
            }
            else{
              res.writeHead(400)
              return res.end(JSON.stringify({error:"Invalid crediential"}))
            }
            }
           
          }
        }
       else if (req.url === "/refresh" && req.method === "POST") {
          const cookieHeader = req.headers.cookie || '';
          // console.log("Raw Cookie Header:", cookieHeader); 
           const refresh_Token = cookieHeader.split('; ').find(row => row.startsWith('refreshToken='))?.split('=')[1];
          //  console.log("token:", refresh_Token)
           if(!refresh_Token){
              res.writeHead(401)
              return res.end(JSON.stringify({error:"Refresh token is invalid"}))
            }
            jwt.verify(refresh_Token,process.env.REFRESH_TOKEN_SECRET, (err, user)=>{
               if (err) {
                      res.writeHead(403);
                      return res.end(JSON.stringify({ error: "Refresh token expired or invalid" }));
                  }
                  const pay_load ={userId : user.userId,email:user.email}
                  const newAccessToken = jwt.sign(pay_load,JWT_SCRETE,{expiresIn:"1h"})
                  res.writeHead(200)
                  return res.end(JSON.stringify({message:newAccessToken}))
            })
        }
        else{
          res.writeHead(404)
          res.end(JSON.stringify({ error: "Not Fou" }))
        }
        
       }
       catch(error){
        console.log(error)
        res.writeHead(500)
        res.end(JSON.stringify({error: "internal serval error", }))
       }
    })
    

 server.listen(process.env.PORT ||3000, () => {
  
  console.log(`Pure Node.js server running at http://localhost:${process.env.PORT}/`);
});