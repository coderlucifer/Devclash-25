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
import ResultPage from '../pages/Resultpage';
import { SocketProvider } from '../context/SocketContext';
import DuelPage from '../pages/DuelPage';




function App() {
  return (
    <>
      <SocketProvider>
      <Routes>
        <Route path="/" element={<Signup/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/signin" element={<Signin/>}/>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/duel-test" element={<DuelTest />} />
        <Route path="/duel" element={<DuelPage/>} />
        <Route path="/test" element={<TestPage/>} />
        <Route path="/start-test" element={<TestSetup/>} />
        <Route path="aiprogresstracker" element={<AiProgressTracker />} />
        <Route path="/result" element={<ResultPage/>} />
      </Routes>
      <Toaster />
      </SocketProvider>
    </>
  )
}

export default App
