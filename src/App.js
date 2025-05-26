import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Main from './Pages/Main';
import Login from './Pages/Login';
import Register from './Pages/Register';
import User from './Pages/User';
import NetworkDetails from './Pages/NetworkDetails';
import FavSpots from './Pages/FavSpots';
import Users from './Pages/Users';
import Admin from './Pages/Admin';
import Admins from './Pages/Admins';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main/>} />
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/user' element={<User/>}/>
        <Route path="/network/:id" element={<NetworkDetails />} />
        <Route path="/fav-spots" element={<FavSpots />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/users" element={<Users />} />
        <Route path="/admin/add" element={<Admins />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
