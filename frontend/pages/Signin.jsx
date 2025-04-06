import React, { useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Signin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      const response = await axios.post("http://localhost:3000/api/student/signin", {
        email,
        password
      }, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json"
        }
      });
      
      console.log("Response:", response.data);
      
      // Handle successful login
      if (response.data.token) {
        // Store the token in localStorage or sessionStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('student',JSON.stringify(response.data.student));
        
        toast.success("Login successful!");
        // Navigate to dashboard or home page instead of login
        navigate('/dashboard');
      } else {
        toast.warning("Login successful but no token received");
        navigate('/dashboard');
      }
    } catch (error) {
      console.error("Error during sign in:", error);
      
      // Handle different error response formats
      if (error.response?.data?.errors) {
        setError(error.response.data.errors);
      } else if (error.response?.data?.msg) {
        setError(error.response.data.msg);
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Invalid email or password. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-t from-black to-blue-950 text-white flex flex-col items-center justify-center p-4">
      <header className='flex items-center justify-between w-full max-w-4xl p-4'>
        <h1 className='text-2xl text-orange-500 font-bold'>STEM SPARK</h1>
        <div className='space-x-3'>
          <Link to="/signup" className='bg-transparent px-4 py-2 border border-white rounded hover:bg-white hover:text-blue-950 transition duration-300'>Sign Up</Link>
        </div>
      </header>

      <div className='bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md mt-4'>
        <h2 className='text-center text-2xl text-orange-500 mb-2'>Welcome Back</h2>
        <p className='text-center text-sm text-gray-400 mb-6'>Sign in to continue learning</p>
        
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col">
              <label htmlFor="email" className="text-sm text-gray-300 mb-1">Email</label>
              <input 
                id="email"
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="bg-gray-800 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" 
                placeholder='Enter your email'
                required 
              />
            </div>
            
            <div className="flex flex-col">
              <label htmlFor="password" className="text-sm text-gray-300 mb-1">Password</label>
              <input 
                id="password"
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="bg-gray-800 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" 
                placeholder='Enter your password'
                minLength="6"
                required 
              />
            </div>

            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-sm text-orange-500 hover:text-orange-400">Forgot password?</Link>
            </div>

            {error && (
              <div className='text-sm text-red-400 p-3 bg-red-900/30 rounded border border-red-800'>
                {error}
              </div>
            )}
            
            <button 
              type="submit" 
              className='bg-orange-500 py-3 rounded-md hover:bg-orange-600 active:bg-orange-700 transition duration-300 font-medium flex justify-center items-center'
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : "Sign In"}
            </button>
          </div>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Don't have an account? 
            <Link to="/signup" className="text-orange-500 hover:text-orange-400 ml-1">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signin;