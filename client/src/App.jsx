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
export default App