import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './Pages/Home';
import Layout from './components/Layout';
import Login from './Pages/Login';
import Register from './Pages/Register';
import User from './Pages/User';
import Profile from './Pages/Profile';
import ProtectedRoute from './auth/ProtectedRoutes';
import ForgotPass from './Pages/ForgotPass';
import AddUser from './Pages/AddUser';

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path='/signin' element={<Login />} />
          <Route path='/pass' element={<ForgotPass />} />
          <Route path='/signup' element={<Register />} />
          <Route path='/users' element={<ProtectedRoute Component={User}/>} />
          <Route path='/profile' element={<ProtectedRoute Component={Profile} />} />
          <Route path='/adduser' element={<ProtectedRoute Component={AddUser} />} />
          <Route path='/updateuser/:id' element={<ProtectedRoute Component={AddUser} />} />
        </Route>
          
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App