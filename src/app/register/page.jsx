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

const Register = () => {
  const router = useRouter();
  
  // Form state management
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName:''
  });
  
  // Password visibility toggles
  const [passwordVisibility, setPasswordVisibility] = useState({
    password: false,
    confirmPassword: false
  });
  
  // Loading state for the submit button
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
  const toggleVisibility = (field) => {
    setPasswordVisibility(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // Validate form inputs
  const validateForm = () => {
    const { username, email, password, confirmPassword ,fullName} = formData;
    
    if (!username || !email || !password || !confirmPassword || !fullName) {
      toast.error("Please fill all the fields");
      return false;
    }
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      toast.error("Please enter a valid email");
      return false;
    }
    
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const { username, email, password,fullName } = formData;
      const response = await axios.post('/api/users/signup', { email, username, password ,fullName});
      if (response.data.success) {
        toast.success(response.data.message);
        router.push('/login');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed. Please try again.");
      console.error("Registration error:", error);
    } finally {
      setIsSubmitting(false);
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
    }
  };

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-black via-gray-900 to-black flex justify-center items-center px-4 py-8">
      <div 
        className="w-full max-w-md backdrop-blur-lg bg-black/40 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden opacity-0 animate-fadeIn"
        style={{ animation: 'fadeIn 0.5s forwards' }}
      >
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className={`text-4xl ${dancingScript.className} font-bold text-white mb-2`}>Create Account</h1>
            <p className="text-gray-400 text-sm">
              Already have an account?{" "}
              <span 
                className="text-cyan-500 hover:text-cyan-400 cursor-pointer transition-colors duration-200"
                onClick={() => router.push("/login")}
              >
                Sign In
              </span>
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-1">
              <label htmlFor="fullName" className="text-sm font-medium text-gray-300">fullName</label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-gray-900/80 border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-transparent transition-all duration-200"
                placeholder="Enter your fullName"
              />
            </div>
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
            </div>
            
            <div className="space-y-1">
              <label htmlFor="password" className="text-sm font-medium text-gray-300">Password</label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={passwordVisibility.password ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-gray-900/80 border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-transparent transition-all duration-200"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => toggleVisibility('password')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {passwordVisibility.password ? <FaEye className="text-xl" /> : <FaEyeSlash className="text-xl" />}
                </button>
              </div>
            </div>
            
            <div className="space-y-1">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-300">Confirm Password</label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={passwordVisibility.confirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-gray-900/80 border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-transparent transition-all duration-200"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => toggleVisibility('confirmPassword')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {passwordVisibility.confirmPassword ? <FaEye className="text-xl" /> : <FaEyeSlash className="text-xl" />}
                </button>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-4 rounded-lg bg-gradient-to-r from-cyan-700 to-cyan-600 hover:from-cyan-600 hover:to-cyan-500 text-white font-medium shadow-lg transition-all duration-300 hover:translate-y-[-2px] ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-gray-800 text-center">
            <p className="text-xs text-gray-500">
              By signing up, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
      
      {/* Add animation keyframes to your global CSS or inline here */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
};

export default Register;