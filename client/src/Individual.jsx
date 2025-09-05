import { useEffect, useState, useMemo ,useRef} from 'react'
import {useGSAP} from "@gsap/react";
import {gsap} from "gsap"
import React from 'react'
import {io} from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";


function Individual() {
  const gsapRef=useRef();
  const [rotate,setRotate]=useState(0);
  useGSAP(
    ()=>{
      const t1=gsap.timeline();

      t1.to(gsapRef.current,{
        duration:2,
        delay:0.2,
        rotate:rotate,
        ease:"power2.inOut"
      });
         t1.to(gsapRef.current,{
        duration:2,
        delay:1,
        rotate:0,
        ease:"power2.inOut"
      });



    },
    {scope:gsapRef,dependencies:[rotate]}
  );
useEffect(()=>{ var h4=document.querySelector(".Box h4");
  console.log(h4.innerHTML)
  var h4Text=h4.textContent;
  var split_Text=h4Text.split("")
  var clutter="";
  var len=Math.ceil(10);
  split_Text.forEach(function(e,i)
{
  let char=e===" "?"&nbsp;":e;
  if(i<=len)
   clutter+=`<span class=${"a"} style="display:inline-block">${char}</span>`  //used inline block to do 2d animations
  else
    clutter+=`<span class=${"b"} style="display:inline-block">${char}</span>`
})
h4.innerHTML=clutter;
console.log(h4.innerHTML)
gsap.from(".Box h4 .a",{
  y:-100,
  x:-100,
   duration:0.3,
  delay:0.5,
  opacity:0,
  stagger:0.3,
 })
 gsap.from(".Box h4 .b",{
  y:100,
  x:100,
   duration:0.3,
  delay:2.1,
  opacity:0,
  stagger:-0.25,
 
 })




},[])
 




  const [message, setMessage]=useState("")
  const [messages, setMessages] = useState([]);
  //setting of permanent userId
  const userId=useMemo(()=>{let userId=localStorage.getItem("userId");
    if(!userId){
      userId=uuidv4(); //generate once
      localStorage.setItem("userId",userId);
    }
    return userId;
  },[])
  const socket=useMemo(()=>io("http://localhost:4000",{query:{userId}}),[]);  //tries to create a persistent connection between client to server , using useMemo() causes no re-rendering when some update is done in the state and hooks ,, but this will start afresh when the app is refreshed ,,
  const [room, setRoom] = useState("");
  const [socketID, setSocketId] = useState("");
  

  console.log(messages)

  const handleSubmit=(e)=>{

  e.preventDefault();//done to prevent default refresh of the page
  
  socket.emit("message_Individual",{message,room})

  setMessage("")
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
   
  return (
    <>
      <Container maxWidth="sm" >
       <Box className="Box"
  sx={{
    height: 200,
    fontSize:"40px",
    fontWeight: "bold",
    color:"rgba(164, 216, 234, 1)",

    fontStyle:"italic",
    display: "flex",           // make it flexbox
    justifyContent: "center",  // horizontal center
    alignItems: "center",      // vertical center
    textShadow:"2px 16px 11px #0f100fff"
  }}
>
  <h4>INDIVIDUAL CHATS</h4>
  
</Box>

      <Typography variant="h6" component="div" gutterBottom   sx={{
    backgroundColor:  "lightgreen",
    backgroundImage:"linear-gradient(to bottom left,green,yellow)",
    padding: "8px",
    borderRadius: "8px",
    margin: "4px 0",
    display:"flex",
    alignSelf:  "flex-start"
  }}>
    <Box sx={{ width: 90 ,fontWeight: "bold"}} >User ID :</Box>

      <Box sx={{ width: 400 }} >{userId}</Box>
    
      </Typography>
        
        
         <Typography variant="h6" component="form" gutterBottom onSubmit={handleSubmit}  sx={{
    backgroundColor:  "lightblue",
    backgroundImage:"linear-gradient(to bottom left,coral,lightblue)",
    padding: "8px",
    borderRadius: "8px",
    margin: "10px 1px",
    display:"flex",
    justifyContent:"center",
    alignItems:"center",
    alignContent:"center"
  }}>
    
     <Box sx={{width:400 , padding:2}} >
        <TextField
          value={message}
          onChange={(e)=> setMessage(e.target.value)}
          id="outlined-basic" 
          required="true"
          label="Start messaging here..."
          variant="outlined"
          /></Box>
   
        <Box sx={{width:400 , padding:2}} >
           <TextField
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          id="outlined-basic"
          required="true"
          label="id_HERE"
          variant="outlined"
        /></Box>
         <Box  sx={{width:400, padding:2}} >
          <Button ref={gsapRef}  type="submit" variant="contained" color="primary" onClick={()=>{setRotate(gsap.utils.random(-360, 360));
            console.log(rotate)
          }} >
           Send 
          </Button>
         </Box>
          </Typography>
       
        <Stack sx={{
    backgroundColor:messages.length>=1?"coral":"lightred",
    padding: "20px",
    borderRadius: "8px",
    margin: "10px 1px",
    display:"flex",
    justifyContent:"center",
    alignItems:"center",
    alignContent:"center"}}>
       {messages.map((m, i) => (
  <Typography key={i} variant="h6" component="div" gutterBottom  
   
  >
    {console.log(m.message)}
    
    {`[Sender->${m.sender} and named->${m.room}] MESSAGE-> ${m.message} at ${m.currentDate} `}
  </Typography>
))}

      </Stack>
  
      </Container>
    </>
  )
}

export default Individual