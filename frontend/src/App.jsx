import './App.css'
import React from 'react'
import {Routes,Route} from 'react-router-dom';
import { Toaster } from 'react-hot-toast'

import Signup from '../pages/Signup'
import Signin from '../pages/Signin';
import Dashboard from "../pages/Dashboard"


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Signup/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/signin" element={<Signin/>}/>
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
      <Toaster />
    </>
  )
}

export default App
