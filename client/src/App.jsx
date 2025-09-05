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

function App()
{
  const [colorNo,setColorNo]=useState(0);
  const colors = ["black", "darkblue", "darkgreen", "maroon", "purple", "gray"];
  const color1=["red ","black"];
  const color2=["yellow", "darkblue"]
  const [color2No,setColor2No]=useState(0);
  return (
    <Box className="toggle" sx={{
        height: "100vh", // full viewport height
        width: "100vw",  // full viewport width
        backgroundImage:`linear-gradient(to bottom, ${color1[color2No]},${color2[color2No]})`,
        backgroundColor: colors[colorNo],
        transition: "background-color 0.5s ease",
       
      }}>
    <Router>
        
        <nav style={{ padding: "15px", borderBottom: "2px solid gray" }}>

          <NavLink to="/" style={({isActive})=>({fontSize:isActive?"20px":"15px", margin: "10px", color:"whitesmoke" })}>Individual Chat</NavLink>
          <NavLink to="/group"style={({isActive})=>({fontSize:isActive?"20px":"15px", margin: "10px", color:"whitesmoke" })}>Group Chat</NavLink>
         <span onClick={()=>
          {setColorNo((prev)=>(prev+1)%colors.length)
           setColor2No((prev)=>(prev+1)%color1.length)}
  }  style={{fontSize:"15px",
   margin:"10px",
   color:"whitesmoke",
   cursor: "pointer",
   textDecoration: "underline",
  }}>
    COLOR TOGGLE
        </span>
        </nav>
        <Routes>
          <Route path="/" element={<Individual/>}/>
          <Route path="/group"element={<Group/>}/>
        </Routes>

    </Router>
    </Box>
  )
}

export default App

