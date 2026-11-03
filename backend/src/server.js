import dotenv from 'dotenv';
dotenv.config();
import db from './config/db.js';

import app from './app.js';

const PORT = process.env.PORT || 5000;

async function startServer() {

    try{
        const connection = await db.getConnection();
        console.log('Mysql connected');
        connection.release();
        app.listen(PORT,()=>{
            console.log(`Server running on http://localhost:${PORT}`)
        });
    }catch(error){
        console.error("db connection failed:", error.message);
        process.exit(1)
    }
    
}

startServer();