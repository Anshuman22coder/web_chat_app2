import React from "react"
import { useEffect, useState, useMemo } from 'react'
import {BrowserRouter as Router, Routes,Route, Link, NavLink} from "react-router-dom"
import Group from "./Group"
import Individual from "./Individual"
import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
<<<<<<< HEAD
function App()
{
=======
function App() {
  const [message, setMessage]=useState("")
  const [messages, setMessages] = useState([]);
  const socket=useMemo(()=>io("https://web-socket-chat-app-cus7.onrender.com"),[]);  //tries to create a persistent connection between client to server , using useMemo() causes no re-rendering when some update is done in the state and hooks ,, but this will start afresh when the app is refreshed ,,
  const [room, setRoom] = useState("");
  const [socketID, setSocketId] = useState("");
  const [roomName, setRoomName] = useState("");

  console.log(messages)

  const handleSubmit=(e)=>{
  e.preventDefault();//done to prevent default refresh of the page
  socket.emit("message",{message,room})

  setMessage("")
  }
  const joinRoomHandler=(e)=>{
    e.preventDefault();
    socket.emit("join-room", roomName);
    alert(`u successfully joined room ${roomName}`)
    console.log(`${socketID}user joined ${roomName}`)
    setRoomName("");
   
  }

  useEffect(()=>{
    const currentDate = new Date().toLocaleTimeString();; // Represents the current date and time
    socket.on("connect",()=>{  //connect is the defaultevent name that is emitted by socket.io when the client successfully establishes connection with the server.
      setSocketId(socket.id);
      console.log("connected",socket.id);

    })
   /* socket.on("welcome",(s)=>{  //for socket.emit  in server side will also have event_name as "welcome"
      console.log(s)
    })*/
    /* socket.on("recieve-message",(s)=>{
      console.log(`${s}`)
     })*/
    socket.on("recieve-message", ({ message, sender ,room}) => {
  console.log("Message from room:", sender, "->", message);
  setMessages((messages) => [...messages, { message, sender,room,currentDate}]);
});

      return()=>{
        console.log("i disconnected")
        socket.disconnect(); //automatic disonnect ,,//when I refresh the page ,,then this will force the cleanup fucntion
      }
  },[socket])  //only when this socket is changed then this will be re-rendered.
   
>>>>>>> 2d70332bf0711a9140a8f282993caf9e2d3d3e0d
  return (
    <Box sx={{
        height: "100vh", // full viewport height
        width: "100vw",  // full viewport width
        backgroundColor: "black",
      }}>
    <Router>

        <nav style={{ padding: "15px", borderBottom: "2px solid gray" }}>

          <NavLink to="/" style={({isActive})=>({fontSize:isActive?"20px":"15px", margin: "10px", color:"whitesmoke" })}>Individual Chat</NavLink>
          <NavLink to="/group"style={({isActive})=>({fontSize:isActive?"20px":"15px", margin: "10px", color:"whitesmoke" })}>Group Chat</NavLink>
        </nav>
        
        <Routes>
          <Route path="/" element={<Individual/>}/>
          <Route path="/group"element={<Group/>}/>
        </Routes>

    </Router>
    </Box>
  )
}
<<<<<<< HEAD
export default App
=======

export default App
>>>>>>> 2d70332bf0711a9140a8f282993caf9e2d3d3e0d
