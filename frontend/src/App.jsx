import React, { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import { toast, Toaster, ToastBar } from 'react-hot-toast'
import { UserProvider } from '../context/userContext';
import Library from './pages/Library';
import Logout from './pages/Logout';
import MyGames from './pages/MyGames';
import More from './pages/More';
import api from './api';

import './styles/App.css';


function App() {
  return (
    <UserProvider>
    <Navbar />
    <Toaster position='bottom-right' toastOptions={{ duration: 3000 }}>
      {(t) => (
        <ToastBar toast={t}>
          {({ icon, message }) => (
            <>
              {icon}
              {message}
              {t.type !== 'loading' && (
                <button className='close' onClick={() => toast.dismiss(t.id)}>&#x2716;</button>
              )}
            </>
          )}
        </ToastBar>
      )}
    </Toaster>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/library" element={<Library />} />
        <Route path="/logout" element={<Logout />} />
        <Route path='/myGames' element={<MyGames />} />
        <Route path="/more" element={<More />} />
      </Routes>
    </UserProvider>
  )
}

export default App;