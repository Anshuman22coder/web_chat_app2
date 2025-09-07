import React from "react";
import{useNavigate} from "react-router-dom"
import { signInWithGoogle } from "./firebase";
import "./Landing.css"
function Landing(){
 const navigate=useNavigate();
 const handleGoogleLogin=async()=>{
  try{
    const result=await signInWithGoogle();
    const email=result.user.email;

    localStorage.setItem("userId",email);
    console.log(localStorage.getItem("userId"));
    navigate("/chat");
    alert("You Successfully logged in")
  }
  catch(error)
  {
    console.error("Login failed",error);
  }


 }
 return(
<div style={{
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between", // pushes footer to bottom
    minHeight: "100vh", // full screen height
    textAlign: "center",
    color: "lightblue",
    textShadow: "2px 16px 11px #0f100fff"
  }} >
  <div style={{ textAlign: "center", marginTop: "50px" ,color:"lightblue",

     textShadow:"2px 16px 11px #0f100fff"
   }}>
      <h1>Welcome to My Chat App</h1>
      <button className="btn" onClick={handleGoogleLogin} 
      style={{
      }}>Sign in with Google</button>
 </div>
      <footer style={{ marginBottom: "20px", color: "black" }}>@anshumancodes.in</footer>
   
  </div>);
  
}
export default Landing