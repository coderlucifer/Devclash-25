import express from "express";
import dotenv from "dotenv"
import mongoose from "mongoose";
import cors from "cors"
import http from "http";
import { Server } from "socket.io";
import studentRoute from "./Routes/studentRoutes.js"
import testRoute from "./Routes/testRoute.js"
import { setupDuelNamespace } from "./duel/duel.js";
const app = express();
dotenv.config();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

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

app.get("/duel", (req, res) => {
    res.json({ message: "Duel mode is active. Connect via Socket.IO namespace '/duel'" });
});
const duelNamespace = io.of("/duel");
setupDuelNamespace(duelNamespace);

app.use("/api/student/",studentRoute); 
app.use("/api/test/",testRoute); 



server.listen(3000, () => {
    console.log("⚔️ Server running on http://localhost:3000");
  });
  