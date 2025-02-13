import React, { useState } from 'react'
import Input from '../components/common/Input'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify';

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const [isLoading,setIsLoading] = useState(false);
   // Check if there's a pending quiz result
   const pendingResult = sessionStorage.getItem('pendingQuizResult');
   const certificate = searchParams.get('redirect');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("All fields are required");
      return;
    }
    try {
      setIsLoading(true);
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

        if (pendingResult && certificate === 'certificate') {
          // navigate('/result/login?redirect=certificate');
          navigate(-1);
          return;
        }

        navigate('/profile');
      } else {
        toast.error(data?.message || "Login failed. Please check your credentials.");
      }
      console.log(data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to log in. Please check your credentials");
    }finally{
      setIsLoading(false);
    }

  }
  return (
    <>
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Sign in to your account
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={handleLogin}>
                <Input name={"Your Email"} placeholder={"your@gmail.com"} id={"email"} type={"email"} onChange={handleChange} value={formData.email}/>
                <Input name="Password" placeholder={"••••••••"} id={"password"} type={"password"} onChange={handleChange} value={formData?.password} />

                <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 bg-blue-400">{isLoading ? "Loading..." :  "Sign in"}</button>
                <Link to="/pass" className="text-sm font-medium text-primary-600 hover:underline text-blue-500">Forgot password?</Link>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Don’t have an account yet? <Link to={pendingResult && certificate === 'certificate' ? "/signup?redirect=certificate" : "/signup"} className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Login