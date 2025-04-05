"use client";

import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import axios from 'axios';
import toast from "react-hot-toast";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { Dancing_Script } from 'next/font/google';

const dancingScript = Dancing_Script({
  weight: ['400', '700'],
  subsets: ['latin'],
});

function Login() {
  const router = useRouter();
  
  // Form state management
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  
  // Password visibility toggle
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  
  // Loading state for submit button
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  // Validate form inputs
  const validateForm = () => {
    const { username, email, password } = formData;
    
    if ((!username && !email) || !password) {
      toast.error("Please provide either username or email, and password");
      return false;
    }
    
    return true;
  };

  // Handle form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const { username, email, password } = formData;
      const response = await axios.post('/api/users/signin', {
        username, email, password
      });
      
      if (response.data.success) {
        toast.success(response.data.message);
        router.push('/dashboard/today');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed. Please check your credentials.");
      console.error("Login error:", error);
    } finally {
      setIsSubmitting(false);
      setFormData({
        username: '',
        email: '',
        password: ''
      });
    }
  };

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-black via-gray-900 to-black flex justify-center items-center px-4 py-8">
      <div className="w-full max-w-md backdrop-blur-lg bg-black/40 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden opacity-0 animate-fadeIn">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className={`text-4xl ${dancingScript.className} font-bold text-white mb-2`}>Welcome Back</h1>
            <p className="text-gray-400 text-sm">
              Don&lsquo;t have an account?{" "}
              <span 
                className="text-cyan-500 hover:text-cyan-400 cursor-pointer transition-colors duration-200"
                onClick={() => router.push("/register")}
              >
                Sign Up
              </span>
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleLogin}>
            <div className="space-y-1">
              <label htmlFor="username" className="text-sm font-medium text-gray-300">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-gray-900/80 border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-transparent transition-all duration-200"
                placeholder="Enter your username"
              />
            </div>
            
            <div className="space-y-1">
              <label htmlFor="email" className="text-sm font-medium text-gray-300">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-gray-900/80 border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-transparent transition-all duration-200"
                placeholder="Enter your email"
              />
              <p className="text-xs text-gray-500 mt-1">Enter either username or email</p>
            </div>
            
            <div className="space-y-1">
              <label htmlFor="password" className="text-sm font-medium text-gray-300">Password</label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={isPasswordVisible ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-gray-900/80 border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {isPasswordVisible ? 
                    <FaEye className="text-xl" /> : 
                    <FaEyeSlash className="text-xl" />
                  }
                </button>
              </div>
            </div>
            
            <div className="flex justify-end">
              <span 
                className="text-cyan-500 hover:text-cyan-400 text-sm cursor-pointer transition-colors duration-200"
                onClick={() => router.push("/recoverpassword")}
              >
                Forgot Password?
              </span>
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-4 rounded-lg bg-gradient-to-r from-cyan-700 to-cyan-600 hover:from-cyan-600 hover:to-cyan-500 text-white font-medium shadow-lg transition-all duration-300 hover:translate-y-[-2px] ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? "Signing In..." : "Sign In"}
            </button>
          </form>
          

        </div>
      </div>
      
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s forwards;
        }
      `}</style>
    </main>
  );
}

export default Login;