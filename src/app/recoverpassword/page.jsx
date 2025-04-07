"use client";

import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import axios from 'axios';
import toast from "react-hot-toast";
import { Dancing_Script } from 'next/font/google';
import { FaArrowLeft } from "react-icons/fa";

const dancingScript = Dancing_Script({
  weight: ['400', '700'],
  subsets: ['latin'],
});

function RecoverPassword() {
  const router = useRouter();
  
  // Multi-step form state
  const [step, setStep] = useState(1);
  
  // Form state management
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Loading state for submit button
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle request for recovery code
  const requestRecoveryCode = async (e) => {
    e.preventDefault();
    
    // Validate email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailPattern.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Replace with your actual API endpoint
      const response = await axios.post('/api/users/request-recovery', { email });
      
      if (response.data.success) {
        toast.success(response.data.message|| "Recovery code sent to your email");
        setStep(2);
      } else {
        toast.error(response.data.message || "Failed to send recovery code");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong. Please try again later.");
      console.error("Recovery request error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle verification and password reset
  const resetPassword = async (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (!verificationCode) {
      toast.error("Please enter the verification code");
      return;
    }
    
    if (!newPassword || newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Replace with your actual API endpoint
      const response = await axios.post('/api/users/reset-password', {
        email,
        verificationCode,
        newPassword
      });
      
      if (response.data.success) {
        toast.success("Password has been reset successfully");
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        toast.error(response.data.message || "Failed to reset password");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password. Please try again.");
      console.error("Password reset error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-black via-gray-900 to-black flex justify-center items-center px-4 py-8">
      <div className="w-full max-w-md backdrop-blur-lg bg-black/40 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden opacity-0 animate-fadeIn">
        <div className="p-8">
          <div className="flex items-center mb-6">
            <button 
              type="button" 
              onClick={() => step === 1 ? router.push('/login') : setStep(1)}
              className="mr-4 text-gray-400 hover:text-white transition-colors duration-200"
            >
              <FaArrowLeft />
            </button>
            <h1 className={`text-3xl ${dancingScript.className} font-bold text-white`}>
              {step === 1 ? "Recover Password" : "Reset Password"}
            </h1>
          </div>
          
          {step === 1 ? (
            <>
              <p className="text-gray-400 text-sm mb-6">
                Enter your email address and we&lsquo;ll send you a code to reset your password.
              </p>
              
              <form className="space-y-5" onSubmit={requestRecoveryCode}>
                <div className="space-y-1">
                  <label htmlFor="email" className="text-sm font-medium text-gray-300">Email Address</label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-gray-900/80 border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 px-4 rounded-lg bg-gradient-to-r from-cyan-700 to-cyan-600 hover:from-cyan-600 hover:to-cyan-500 text-white font-medium shadow-lg transition-all duration-300 hover:translate-y-[-2px] ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? "Sending Code..." : "Send Recovery Code"}
                </button>
              </form>
            </>
          ) : (
            <>
              <p className="text-gray-400 text-sm mb-6">
                Enter the verification code sent to your email and create a new password.
              </p>
              
              <form className="space-y-5" onSubmit={resetPassword}>
                <div className="space-y-1">
                  <label htmlFor="verificationCode" className="text-sm font-medium text-gray-300">Verification Code</label>
                  <input
                    id="verificationCode"
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-gray-900/80 border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-transparent transition-all duration-200"
                    placeholder="Enter verification code"
                    required
                  />
                </div>
                
                <div className="space-y-1">
                  <label htmlFor="newPassword" className="text-sm font-medium text-gray-300">New Password</label>
                  <input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-gray-900/80 border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-transparent transition-all duration-200"
                    placeholder="Create new password"
                    required
                    minLength={8}
                  />
                </div>
                
                <div className="space-y-1">
                  <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-300">Confirm Password</label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-gray-900/80 border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-transparent transition-all duration-200"
                    placeholder="Confirm new password"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 px-4 rounded-lg bg-gradient-to-r from-cyan-700 to-cyan-600 hover:from-cyan-600 hover:to-cyan-500 text-white font-medium shadow-lg transition-all duration-300 hover:translate-y-[-2px] ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? "Resetting Password..." : "Reset Password"}
                </button>
              </form>
            </>
          )}
          
          <div className="mt-8 pt-6 border-t border-gray-800 text-center">
            <p className="text-xs text-gray-500">
              Remember your password?{" "}
              <span 
                className="text-cyan-500 hover:text-cyan-400 cursor-pointer transition-colors duration-200"
                onClick={() => router.push("/login")}
              >
                Sign In
              </span>
            </p>
          </div>
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

export default RecoverPassword;