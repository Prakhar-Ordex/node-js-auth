import React, { Children, useEffect, useState } from 'react'
import UserDetailComponent from '../components/common/UserDetailComponent'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify';
import { dateFormated } from '../utils/dateFormater';

const AddUser = () => {
  const navigate = useNavigate();;
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    joiningDate: "",
    department: "",
    salary: 0,
  })

  const findEmployees = async () => {
    try {
      const user = await fetch(`http://localhost:3000/apis/users/${id}`, {
        credentials: 'include'
      })
      const data = await user.json();
      console.log(data)
      if (user.status === 200) {
        const employee = data?.data;
        setFormData({
          name: employee.name,
          joiningDate: dateFormated(employee?.joiningDate),
          department: employee.department,
          salary: employee.salary
        })
      }
    } catch (error) {
      toast.error("Failed to fetch user details")
    }
  }
  useEffect(() => {
    if (id) {
      findEmployees()
    }
  }, [id]);

  const handleUser = async (e) => {
    e.preventDefault();
    if (!formData.salary || !formData.joiningDate || !formData.name || !formData.department) {
      toast.error("All fields are required");
      return;
    }

    try {
      const api = id ? `http://localhost:3000/apis/update/${id}` : `http://localhost:3000/apis/create`;
      const User = await fetch(api, {
        method: id ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
      const data = await User.json();
      if (User.status === 201) {
        navigate('/users')
        toast.success(data?.message)
      } else {
        toast.error(data.error)
      }
      if (User.status === 410) {
        navigate("/signin");
        localStorage.clear();
        toast.error("Session expired, please signin again");
      }
      console.log(data);
    } catch (error) {
      console.log(error);
      toast.error("something went wrong");
    }
  }


  return (
    <>
      <UserDetailComponent formData={formData} setFormData={setFormData} handleLogin={handleUser} />
    </>
  )
}

export default AddUser