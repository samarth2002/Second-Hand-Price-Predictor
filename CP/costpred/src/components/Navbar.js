import React from 'react'
import { Link, Navigate } from "react-router-dom"
import './Navbar.css'
function Navbar() {
  return (
    <div className='navbar-main'>
         <Link to="/">Home</Link>
    </div>
  )
}

export default Navbar