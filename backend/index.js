import express from "express";
import dotenv from "dotenv"
import mongoose from "mongoose";
import cors from "cors"

import studentRoute from "./Routes/studentRoutes.js"

const app = express();
dotenv.config();

app.use(cors({
    origin: process.env.FRONTEND,
    credentials: true, // to access cookies
    methods: ["GET","POST","PUT","DELETE"],
    allowedHeaders: ["Content-Type","Authorization"]
}));

app.use(express.json());


try{
   await mongoose.connect(process.env.MONGO_URL);
    console.log("db connected");
}catch(e){
    console.log(e);
}

app.use("/api/v1/",studentRoute); 



app.listen(3000);