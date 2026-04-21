import mongoose from 'mongoose';
import express from 'express';
import {createServer} from 'http';
import { Server }  from 'socket.io';
import {YSocketIO} from 'y-socket.io/dist/server';
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'
import cors from 'cors'

dotenv.config()

const app = express();
app.use(express.json());
app.use(cors({
   origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}))
app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected ✔'))
  .catch(err => console.log('MongoDB Error:', err.message))

const httpServer = createServer(app)

const io = new Server(httpServer,{
    cors:{
        origin:"*",
       methods:["GET","POST"]
            
        
    }
})


const ySocketIO = new YSocketIO(io);
ySocketIO.initialize();

io.on("connection", (socket) => {
  socket.on("join-room", (roomId) => {
    socket.join(roomId)
    console.log(`User joined room: ${roomId}`)
  })

  socket.on("send-message", ({ roomId, message, username, color }) => {
    io.to(roomId).emit("receive-message", { message, username, color })
  })
})

// app.get("/",(req,res)=>{
//     res.status(200).json({
//         message:"welcome to the real time editor backend",
//         succes:true
//     })
// })

app.get('/health',(req,res)=>{
    res.status(200).json({
        message:"ok",
        succes:true
    })    
})

// Routes
app.use('/api/auth', authRoutes)

app.get('/health', (req, res) => {
  res.status(200).json({ message: "ok", success: true })
})
httpServer.listen(3000,()=>{
    console.log('Server is running on port 3000');
})
