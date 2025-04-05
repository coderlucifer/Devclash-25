import './App.css'
import React from 'react'
import {Routes,Route} from 'react-router-dom';
import { Toaster } from 'react-hot-toast'

import Signup from '../pages/Signup'
import Signin from '../pages/Signin';
import Dashboard from "../pages/Dashboard"
import DuelTest from '../pages/DuelTest';
import TestPage from '../pages/TestPage';
import TestSetup from '../pages/TestSetup';
import AiProgressTracker from '../pages/AiProgessTracker';




function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Signup/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/signin" element={<Signin/>}/>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/duel" element={<DuelTest />} />
        <Route path="/test" element={<TestPage/>} />
        <Route path="/start-test" element={<TestSetup/>} />
        <Route path="aiprogresstracker" element={<AiProgressTracker />} />
      </Routes>
      <Toaster />
    </>
  )
}

export default App
