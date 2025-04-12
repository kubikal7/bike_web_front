import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Main from './Pages/Main';
import Login from './Pages/Login';
import Register from './Pages/Register';
import User from './Pages/User';
import NetworkDetails from './Pages/NetworkDetails';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main/>} />
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/user' element={<User/>}/>
        <Route path="/network/:id" element={<NetworkDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
