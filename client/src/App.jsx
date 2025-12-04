import { useState } from 'react'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from './components/home.jsx';
import LoginPage from './components/hospital/Login.jsx';
import SignupPage from './components/hospital/Signup.jsx';

function App() {

  return (
    <>
    <Router>
      <Routes>
        <Route path="" element={<LoginPage/>}/>
        <Route path="/signup" element={<SignupPage/>}/>
      </Routes>
    </Router>
    </>
  )
}

export default App
