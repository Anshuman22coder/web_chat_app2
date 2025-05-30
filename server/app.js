import express from "express"
import { Server } from "socket.io"
import {createServer} from "http"
const app=express()

const server=createServer(app);//the whole server is instantiated ..
const io=new Server(server,{
  cors:{
    origin:"*",
    methods:["GET","POST"],
    credentials:true
  }
}); //the whole io circut is instantaited..

io.on("connection",(socket)=>{  //listens .. to incomming connections..
  console.log("User Connected");
  console.log("Id",socket.id);
  //socket.emit("welcome",`welcome to the server ${socket.id}`);
  socket.on("message",({room,message})=>{
    console.log({room,message});//triggered by frontend when button of form is submitted ,,
   socket.to(room).emit("recieve-message",message);
  })
  socket.on("join-room",(room)=>{
    socket.join(room);
    console.log(`User joined room ${room}`);
  })
  
  socket.on("disconnect",()=>{  //triggered from frontend
    console.log("User disconnected",socket.id);
  })
})

app.get("/",(req,res)=>{
  res.send("HI")
})
server.listen (3000,()=>{
  console.log('server listening at 3000')
})