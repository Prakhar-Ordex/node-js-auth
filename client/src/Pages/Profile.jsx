import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

const Profile = () => {
    const[data,setData] = useState({})
  
    const fetchData = async () => {
        try {
          const response = await fetch('http://localhost:3000/auth/profile', {
            credentials: 'include'
          });
          const jsonData = await response.json();
          if (response.ok) {
            console.log(jsonData)
            setData(jsonData.user)
          }
          if (response.status === 410) {
            navigate("/signin")
            localStorage.clear()
            toast.error("Session expired, please signin again")
          }
        } catch (error) {
          console.error('Error:', error);
          toast.error("something went wrong")

        }
      }
      useEffect(()=>{
        fetchData();
      },[])
    return (
        <div className='max-h-[100vh] max-w-[100vw] flex justify-center items-center flex-col'>
            <div className='text-4xl bold'>Profile Page</div>
            <div className='text-2xl bold'>id:{data?.id}</div> <br />
            <div className='text-2xl bold'>name:{data?.username}</div>
            <div className='text-2xl bold'>email:{data?.email}</div>
        </div>
    )
}

export default Profile