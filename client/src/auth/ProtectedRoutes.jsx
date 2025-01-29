import React, { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import {  isLogin } from "../utils/auth";
import { toast } from "react-toastify";

const ProtectedRoute = ({ Component }) => {
 
  const location = useLocation();
  const [isLoggin,setLoggin] = useState(isLogin());
  

  useEffect(()=>{
      setLoggin(isLogin());
     if(!isLoggin ){
        toast.warning("you must login")
     }
  },[location]);

  return (
    <>
    {
      isLoggin ? 
      <Component/> : 
      <Navigate to="/signin" />
    }
    </>
  );
};

export default ProtectedRoute;