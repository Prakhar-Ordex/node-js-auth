import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Profile = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
  
    const fetchData = async () => {
        try {
          const response = await fetch('http://localhost:3000/auth/profile', {
            credentials: 'include'
          });
          const jsonData = await response.json();
          if (response.ok) {
            console.log(jsonData);
            setData(jsonData.user);
          }
          if (response.status === 410) {
            navigate("/signin");
            localStorage.clear();
            toast.error("Session expired, please signin again");
          }
        } catch (error) {
          console.error('Error:', error);
          toast.error("Something went wrong");
        } finally {
          setLoading(false);
        }
      };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className='min-h-screen flex justify-center items-center flex-col bg-gray-100 p-6'>
            {loading ? (
                <div className='flex flex-col items-center'>
                    <div className='w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin'></div>
                    <p className='mt-4 text-xl font-semibold text-gray-600'>Loading...</p>
                </div>
            ) : (
                data ? (
                    <div className='bg-white shadow-lg rounded-lg p-6 max-w-lg w-full text-center'>
                        <h1 className='text-4xl font-bold text-gray-800 mb-4'>Profile Page</h1>
                        <p className='text-2xl font-semibold text-gray-700'>ID: {data?.id}</p>
                        <p className='text-2xl font-semibold text-gray-700'>Name: {data?.username}</p>
                        <p className='text-2xl font-semibold text-gray-700'>Email: {data?.email}</p>
                    </div>
                ) : (
                    <p className='text-xl font-semibold text-gray-700'>No profile data available</p>
                )
            )}
        </div>
    );
}

export default Profile;
