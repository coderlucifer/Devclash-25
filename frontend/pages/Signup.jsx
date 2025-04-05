import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Signup() {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [Board, setBoard] = useState("");
  const [std, setStd] = useState("");
  const [testCompleted,setTestCompleted]=useState(0)
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Log the data being sent to verify it matches backend expectations
      const requestData = {
        firstName,
        lastName,
        email,
        password,
        Board,
        testCompleted,
        std: std ? parseInt(std) : undefined
      };
      console.log("Sending data:", requestData);
      
      const response = await axios.post("http://localhost:3000/api/v1/signup", requestData, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json"
        }
      });
      
      console.log("Response:", response.data);
      
      if (response.data.message === "User with this email already exists") {
        setError("User with this email already exists");
      } else {
        toast.success("Signup successful!");
        navigate('/signin');
      }
    } catch (error) {
      console.error("Error during signup:", error);
      
      if (error.response?.data?.errors) {
        setError(error.response.data.errors);
      } else if (error.response?.data?.msg) {
        setError(error.response.data.msg);
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-t from-black to-blue-950 text-white flex flex-col items-center justify-center p-4">
      <header className='flex items-center justify-between w-full max-w-4xl p-4'>
        <h1 className='text-2xl text-orange-500 font-bold'>C0urs0</h1>
        <div className='space-x-3'>
          <Link to="/login" className='bg-transparent px-4 py-2 border border-white rounded hover:bg-white hover:text-blue-950 transition duration-300'>Log In</Link>
        </div>
      </header>

      <div className='bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md mt-4'>
        <h2 className='text-center text-2xl text-orange-500 mb-2'>C0urs0</h2>
        <p className='text-center text-sm text-gray-400 mb-4'>Just Signup to Join us!</p>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input 
                type="text" 
                value={firstName} 
                onChange={(e) => setFirstName(e.target.value)} 
                className="bg-gray-800 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" 
                placeholder='First Name'
                required 
              />
              <input 
                type="text" 
                value={lastName} 
                onChange={(e) => setLastName(e.target.value)} 
                className="bg-gray-800 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" 
                placeholder='Last Name'
                required 
              />
            </div>
            
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="bg-gray-800 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" 
              placeholder='Email'
              required 
            />
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="bg-gray-800 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" 
              placeholder='Password'
              minLength="6"
              required 
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="relative">
                <select 
                  value={Board} 
                  onChange={(e) => setBoard(e.target.value)} 
                  className="bg-gray-800 p-3 rounded-md appearance-none w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                >
                  <option value="">Select Board</option>
                  <option value="CBSE">CBSE</option>
                  <option value="ICSE">ICSE</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>

              <div className="relative">
                <select 
                  value={std} 
                  onChange={(e) => setStd(e.target.value)} 
                  className="bg-gray-800 p-3 rounded-md appearance-none w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                >
                  <option value="">Select Standard</option>
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>

            {error && <div className='text-sm text-red-400 p-2 bg-red-900/30 rounded'>{error}</div>}
            
            <button 
              type="submit" 
              className='bg-orange-500 py-2 rounded-md hover:bg-green-500 transition duration-300 font-medium flex justify-center items-center'
              disabled={isLoading}
            >
              {isLoading ? "Signing up..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Signup;