import { useState } from 'react'
import './App.css'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';
import Dashboard from './components/dashboard.jsx';

function App() {

  return (
    <>
    <Router>
      <Routes>
        <Route path="" element={<Login/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>

      </Routes>
    </Router>
    </>
  )
}

export default App
