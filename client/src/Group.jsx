import { useEffect, useState, useMemo } from "react";
import React from "react";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

function Group() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  //setting of permanent userId
  const userId = useMemo(() => {
    let userId = localStorage.getItem("userId");
    if (!userId) {
      userId = uuidv4(); //generate once
      localStorage.setItem("userId", userId);
    }
    return userId;
  }, []);
  const socket = useMemo(
    () => io("https://web-socket-chat-app-1-backend-2.onrender.com/", { query: { userId } }),
    []
  );
  const [room, setRoom] = useState("");
  const [socketID, setSocketId] = useState("");
  const [roomName, setRoomName] = useState("");

  console.log(messages);

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", { message, room });
    setMessage("");
  };

  const joinRoomHandler = (e) => {
    e.preventDefault();
    socket.emit("join-room", roomName);
    alert(`✅ Successfully joined room ${roomName}`);
    console.log(`${socketID} user joined ${roomName}`);
    setRoomName("");
  };

  useEffect(() => {
    const currentDate = new Date().toLocaleTimeString();
    socket.on("connect", () => {
      setSocketId(socket.id);
      console.log("connected", socket.id);
    });

    socket.on("recieve-message", ({ message, sender, room }) => {
      console.log("Message from room:", sender, "->", message);
      setMessages((messages) => [
        ...messages,
        { message, sender, room, currentDate },
      ]);
    });

    return () => {
      console.log("i disconnected");
      socket.disconnect();
    };
  }, [socket]);

  return (
    <>
      <Container maxWidth="sm">
        <Box
         sx={{
           height: 200,
           fontSize:"40px",
           fontWeight: "bold",
           color: "coral",
           display: "flex",           // make it flexbox
           justifyContent: "center",  // horizontal center
           alignItems: "center",      // vertical center
         }}
       >
        GROUP CHATS
       </Box>

        {/* User ID box */}
        <Typography
          variant="h6"
          component="div"
          gutterBottom
          sx={{
            backgroundColor: "lightgreen",
            padding: "8px",
            borderRadius: "8px",
            margin: "4px 0",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Box sx={{ width: 90, fontWeight: "bold" }}>User ID:</Box>
          <Box sx={{ width: 400, wordBreak: "break-all" }}>{userId}</Box>
        </Typography>

        {/* Join Room */}
        <Box
          component="form"
          onSubmit={joinRoomHandler}
          sx={{
            backgroundColor: "lightyellow",
            padding: "16px",
            borderRadius: "8px",
            margin: "12px 0",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
          }}
        >
          <TextField
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            label="Room Name"
            variant="outlined"
          />
          <Button type="submit" variant="contained" color="primary">
            Join
          </Button>
        </Box>

        {/* Send Message */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            backgroundColor: "lightblue",
            padding: "16px",
            borderRadius: "8px",
            margin: "12px 0",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <TextField
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            label="Start messaging here..."
            variant="outlined"
            fullWidth
          />
          <TextField
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            label="Group Room Name"
            variant="outlined"
            fullWidth
          />
          <Button type="submit" variant="contained" color="primary">
            Send
          </Button>
        </Box>

        {/* Messages */}
        <Stack
          sx={{
            backgroundColor: messages.length > 0 ? "coral" : "black",
            color: "white",
            padding: "20px",
            borderRadius: "8px",
            margin: "12px 0",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: 1,
          }}
        >
          {messages.map((m, i) => (
            <Typography
              key={i}
              variant="body1"
              sx={{
                backgroundColor: "rgba(255,255,255,0.2)",
                padding: "8px",
                borderRadius: "6px",
                width: "100%",
              }}
            >
              {`[Sender: ${m.sender} | Group: ${m.room}] → ${m.message}  @ ${m.currentDate}`}
            </Typography>
          ))}
        </Stack>
      </Container>
    </>
  );
}

export default Group;
