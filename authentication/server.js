import dotenv from 'dotenv'
import { worker } from './src/queues/emailWorker.js'
import { app } from './app.js'
const PORT = process.env.PORT || 3000
app.listen(PORT, ()=>{
    console.log(`server runing on http://localhost:${PORT}/api/auth/`)
})