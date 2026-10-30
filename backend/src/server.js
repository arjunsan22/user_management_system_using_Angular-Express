const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>{
    res.send('API is running successfully!');
});

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