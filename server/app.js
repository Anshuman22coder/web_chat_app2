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
const userSocketmap={} //userId:socket.id

io.on("connection",(socket)=>{  //listens .. to incomming connections..
  //1.client connects
  const userId=socket.handshake.query.userId;
  if(userId)
  {
    userSocketmap[userId]=socket.id;
    console.log(`User ${userId} connected with socket ${socket.id}`);
  }

  console.log("User Connected");
  console.log("Id",socket.id);

  //socket.emit("welcome",`welcome to the server ${socket.id}`);
  socket.on("message",({room,message})=>{ // 2. message received from client
    console.log({room,message});//triggered by frontend when button of form is submitted ,,
   socket.to(room).emit("recieve-message", { message,sender: userId ,room}); 
    /*{
  message: "hello",
  sender: "abc123"
}*/

  })
  let sendervalue;
    socket.on("message_Individual",({room,message})=>{ // 2. message received from client
      if((Object.entries(userSocketmap).length)>1)
        console.log("PRESENT")
      for (let [key,value] of Object.entries(userSocketmap))  //objects to arrays..
      { key=key.trim()
        if(key===room.trim())
        {
           sendervalue=value;
           console.log("I entered here")
           break;
        }
        console.log({"key":key})
        
      }
      console.log({room,message});//triggered by frontend when button of form is submitted ,,
   socket.to(sendervalue).emit("recieve-message", { message,sender: userId ,room}); 
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
