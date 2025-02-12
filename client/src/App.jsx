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
// import CertificateForm from './Pages/CertificateForm';
import { Quiz } from './Pages/Quiz';
import { Certificate } from './Pages/Certificate';
import { Result } from './Pages/Result';
import CertificationCards from './Pages/CertificationCards';
import NotFoundPage from './Pages/NotFoundPage';

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
            <Route path='/users' element={<ProtectedRoute Component={User} />} />
            <Route path='/profile' element={<ProtectedRoute Component={Profile} />} />
            <Route path='/adduser' element={<ProtectedRoute Component={AddUser} />} />
            <Route path='/updateuser/:id' element={<ProtectedRoute Component={AddUser} />} />
            {/* <Route path="/quiz" element={<Quiz />} /> */}
            <Route path="/certificate/:id" element={<Certificate />} />
            <Route path="/result/:path" element={<Result />} />
            <Route path="/skill-tests" element={<CertificationCards />} />
            <Route path="/quiz/:test" element={<Quiz />} />
            <Route path='*' element={<NotFoundPage/>}/>
          </Route>

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App