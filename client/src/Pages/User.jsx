import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { formatedDate } from '../utils/dateFormater';
import { Link, useNavigate } from 'react-router-dom';

const User = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); 

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/apis/read', {
        credentials: 'include'
      });
      const jsonData = await response.json();
      if (response.ok) {
        setData(jsonData);
      }
      if (response.status === 410) {
        navigate("/signin")
        localStorage.clear()
        toast.error("Session expired, please signin again")
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("something went wrong")
      setData([])
    } finally {
      setLoading(false);
    }
  }

  const deleteEmployee = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/apis/delete/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      const jsonData = await response.json();
      if (response.ok) {
        toast.success(jsonData.message)
        fetchData();
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("something went wrong")
    } finally {
      setLoading(false);
    }

  }

  useEffect(() => {
    fetchData();
  }, [])
  return (
    <>
      <div className='flex justify-between mx-12 mb-4'>
        <div className='text-2xl  font-bold'>User Details</div>
        <div>
          <Link to={"/adduser"} className='text-xl bold bg-blue-400 rounded-md p-1 text-white'> + Add User</Link>
        </div>
      </div>
      {
        loading ?
          <div className='max-h-[90vh] max-w-[90vw] flex justify-center items-center text-2xl font-extrabold'>Loading...</div>
          : data.length === 0 ? <>
            <div className='text-xl font-bold text-center'>No Users Found</div>
          </> :

            <>

              <ul role="list" className="divide-y divide-gray-100 mx-10">
                {data?.map((person) => (
                  <li key={person?.id} className="flex justify-between gap-x-6 py-5">
                    <div className="flex min-w-0 gap-x-4">
                      <div className="size-12 flex-none rounded-full bg-blue-200 text-black text-center text-2xl font-extrabold p-1.5" >{person.name?.charAt(0)?.toUpperCase()}</div>
                      <div className="min-w-0 flex-auto">
                        <p className="text-sm/6 font-semibold text-gray-900"><span>{person?.id} . </span>{person?.name}</p>
                        <p className="mt-1 truncate text-gray-500 text-l">{person?.department}</p>
                      </div>
                    </div>
                    <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                      <p className="text-sm/6 text-gray-900">{person?.role}</p>
                      <div className="mt-1 flex items-center gap-x-1.5">
                        <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                          <div className="size-1.5 rounded-full bg-emerald-500" />
                        </div>
                        <p className="text-xs/5 text-gray-500">{formatedDate(person?.joiningDate)}</p>

                      </div>
                      <div>
                        <Link to={`/updateUser/${person?.id}`} className='bg-blue-400 rounded-md p-1 m-1 text-white'>update</Link>
                        <button onClick={() => { deleteEmployee(person?.id) }} className='bg-red-400 rounded-md p-0.5 text-white'>Delete</button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </>
      }
    </>
  )
}

export default User