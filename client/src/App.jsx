import { useEffect, useState, useMemo } from 'react'
import React from 'react'
import {io} from "socket.io-client";
import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
function App() {
  const [message, setMessage]=useState("")
  const [messages, setMessages] = useState([]);
  const socket=useMemo(()=>io("http://localhost:3000"),[]);  //tries to create a persistent connection between client to server , using useMemo() causes no re-rendering when some update is done in the state and hooks ,, but this will start afresh when the app is refreshed ,,
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
    console.log(`${socketID}user joined ${roomName}`)
    setRoomName("");
   
  }

  useEffect(()=>{
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
     socket.on("recieve-message", (data) => {
      console.log(data);
      setMessages((messages) => [...messages, data]);
    });
      return()=>{
        socket.disconnect(); //automatic disonnect ,,//when I refresh the page ,,then this will force the cleanup fucntion
      }
  },[socket])  //only when this socket is changed then this will be re-rendered.
   
  return (
    <>
      <Container maxWidth="sm">
        <Box sx={{ height: 500 }} />
      <Typography variant="h6" component="div" gutterBottom>
        {socketID}
      </Typography>
      <form onSubmit={joinRoomHandler}>
        <h5>Join Room</h5>
        <TextField
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          id="outlined-basic"
          label="Room Name"
          variant="outlined"
        />
        <Button type="submit" variant="contained" color="primary">
          Join
        </Button>
      </form>
        <form onSubmit={handleSubmit}>
          <TextField
          value={message}
          onChange={(e)=> setMessage(e.target.value)}
          id="outlined-basic" 
          label="Outlined"
          variant="outlined"
          />
          <TextField
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          id="outlined-basic"
          label="INDIVIDUAL_Room_HERE"
          variant="outlined"
        />
          <Button type="submit" variant="contained" color="primary">
           Send 
          </Button>
        </form>
        <Stack>
        {messages.map((m, i) => (
          <Typography key={i} variant="h6" component="div" gutterBottom>
            {m}
          </Typography>
        ))}
      </Stack>
      </Container>
    </>
  )
}

export default App
