import React from 'react'
import { Link, Navigate } from "react-router-dom"
import './Navbar.css'
function Navbar() {
  return (
    <div className='navbar'>
         <Link to="/">Welcome to EasyPredicts</Link>
    </div>
  )
}

export default Navbar