
//this is only for practice purpose
import { useEffect,useState,useMemo } from "react";
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
import { use } from "react";
function App(){
  const [socketID,setSocketId]=useState("")
  const [messages, setMessages] = useState([]);
  const socket=useMemo(()=>io("http://localhost:3000"),[])
  useEffect(()=>{
    socket.on("connect",()=>
    {
       setSocketId((socketID)=>socket.id)
       console.log("connected",socket.id);
    })
    socket.on("recieve-message",(data)=>
      {
        console.log(data);
        setMessages((messages)=>[...messages,data]) 
      }
      )
      return()=>{//emitting disconnect message/request..
        socket.disconnect(); //automatic disonnect ,,//when I refresh the page ,,then this will force the cleanup fucntion
      }
    },[socket])  //only when this socket is changed then this will be re-rendered.
    
 }

