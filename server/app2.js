//this is only for practice purpose

import express from "express"
import { Server } from "socket.io"
import {createServer} from "http"
const app=express()

const server=createServer(app);
const io=new Server(server,{
  cors:{
    origin:"*",
    methods:["GET","POST"],
    credentials:true
  }
})
io.on("connection",(socket)=>{
  console.log("User connected ");
  console.log("Id",socket.id);
  socket.on("message",({room,message})=>{
    socket.to(room).emit('recieve-message',message);
  })
  socket.on("join-room",(room)=>{
    socket.join(room);
    console.log(`User joined room ${room}`);
  })
  socket.on("disconnect",()=>{
    console.log("user disconnected")
  })
})