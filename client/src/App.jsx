import { useState } from 'react'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from './components/home.jsx';
import LoginPage from './components/hospital/Login.jsx';
import SignupPage from './components/hospital/Signup.jsx';
import Formdata from './components/hospital/Formdata.jsx';
import Dashboard from './components/hospital/Dashboard.jsx';

function App() {

  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/signup" element={<SignupPage/>}/>
        <Route path="/formdata" element={<Formdata/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
      </Routes>
    </Router>
    </>
  )
}

export default App
