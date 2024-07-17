import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoute.js';
import categoryRoutes from './routes/categoryRoute.js';
import productRoutes from './routes/productRoute.js';
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';

// if .env is not in root folder use .config({path:'required path'})
dotenv.config();
connectDB();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



// rest object
const app = express()

// middleware
app.use(express.json())
app.use(morgan('dev'))
app.use(cors());
app.use(express.static(path.join(__dirname, "./client/build")))

// routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/category', categoryRoutes);
app.use('/api/v1/product', productRoutes);

app.use('*', function(req, res){
    res.sendFile(path.join(__dirname,"./client/build/index.html" ))
})


// rest api
app.get('/', (req, res)=>{
    res.send("<h1> WELOME TO MY-MARKET</h1>")
})

// PORT
// const PORT = 8080
const PORT = process.env.PORT || 8080;

app.listen(PORT, ()=>{
    console.log(`Server running on ${PORT}`)
})