import React, { useState } from 'react'

import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import Input from './Input';

const UserDetailComponent = ({formData,setFormData,handleLogin}) => {

  const handleChange = (e) => {
    const {name,value} = e.target;
    setFormData({...formData,[name]:value})
  }

  
  return (
    <>
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                ADD EMPLOYEE DATA
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={handleLogin}>
                <Input  name={"Employee Name"} placeholder={"username"} id={"name"} type={"text"} onChange={handleChange} value={formData?.name}/>
                <Input name={"Employee Department"} placeholder={"department"} id={"department"} type={"text"} onChange={handleChange} value={formData?.department}/>
                <Input name="Employee Salary"  placeholder={"XXXXXXX"} id={"salary"} type={"number"} onChange={handleChange} value={formData?.salary}/>
                <Input name="Employee JoiningDate"  placeholder={"date"} id={"joiningDate"} type={"date"} onChange={handleChange} value={formData?.joiningDate}/>

                <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 bg-blue-400">ADD DATA</button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default UserDetailComponent;