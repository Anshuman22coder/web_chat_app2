import express from "express"
import { Server } from "socket.io"
import {createServer} from "http"
const app=express()

const server=createServer(app);//the whole server is instantiated ..with http
const io=new Server(server,{
  cors:{
    origin:"*",
    methods:["GET","POST"],
    credentials:true
  }
}); //the whole io circut is instantaited..

io.on("connection",(socket)=>{  //listens .. to incomming connections..
  //1.client connects
  console.log("User Connected");
  console.log("Id",socket.id);
  //socket.emit("welcome",`welcome to the server ${socket.id}`);
  socket.on("message",({room,message})=>{ // 2. message received from client
    console.log({room,message});//triggered by frontend when button of form is submitted ,,
   socket.to(room).emit("recieve-message", { message,sender: socket.id ,room}); 
    /*{
  message: "hello",
  sender: "abc123"
}*/

  })
  
  // 3. client wants to join a room
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