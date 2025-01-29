import React, { useState } from 'react'
import Input from '../components/common/Input'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';

const ForgotPass = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.email ) {
      toast.error("please emter your valid mail address");
      return;
    }
    try {
      const loginUser = await fetch('http://localhost:3000/auth/signIn', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      })

      const data = await loginUser.json();

      if (loginUser.ok) {
        if (loginUser.status === 200) {
          localStorage.setItem('loginUser', JSON.stringify(data.data));
          toast.success("Logged in successfully")
        }


        if (loginUser.status === 210) {
          toast.warning(data?.message || "Aleredy login");
        }

        navigate('/profile');
      } else {
        toast.error(data?.message || "Login failed. Please check your credentials.");
      }
      console.log(data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to log in. Please check your credentials");
    }

  }
  return (
    <>
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Reset Your Password 
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={handleLogin}>
                <Input name={"Enter Your Email"} placeholder={"your@gmail.com"} id={"email"} type={"email"} onChange={handleChange} />

                <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 bg-blue-400">Sign in</button>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Don’t have an account yet? <Link to="/signup" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default ForgotPass