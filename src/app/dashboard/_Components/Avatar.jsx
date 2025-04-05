'use client'
import React, { useState, useRef, useEffect } from 'react'
import { cn } from "../../../lib/utils"
import { User, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { authlogout } from "../../../store/userSlice"

function Avatar({ name,  width = 10 }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  const router = useRouter()
  const dispatch= useDispatch();
  const nameinitials = name ? name.split(' ') : [];
  let initials = '';
  if (nameinitials.length > 1) {
    initials = nameinitials[0].charAt(0).toUpperCase() + nameinitials[1].charAt(0).toUpperCase();
  } else if (nameinitials.length === 1) {
    initials = nameinitials[0].charAt(0).toUpperCase();
  }
  
  // Use size mapping for Tailwind classes
  const sizeClasses = {
    10: 'w-10 h-10 text-lg',
    12: 'w-12 h-12 text-xl',
    16: 'w-16 h-16 text-2xl',
    20: 'w-20 h-20 text-3xl',
  }
  
  // Default to w-10/h-10 if size not in mapping
  const sizeClass = sizeClasses[width] || 'w-10 h-10 text-lg'
  
  const handleProfileClick = () => {
    router.push('/dashboard')
    setIsOpen(false)
  }
  
  const handleLogoutClick = async() => {
    try{
       const response= await axios.get('/api/users/logout');
       if(response.data.success){
        toast.success("user is successfully logout")
        dispatch(authlogout())
        router.push('/')
       }
    }
    catch(error){
       toast.error(error.response.data.message||"failed to logout")
    }
    finally{
        setIsOpen(false)
    }

  }
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])
  
  return (
    <div className="relative" ref={dropdownRef}>
      <div 
        className={cn(
          sizeClass,
          'bg-cyan-300 rounded-full flex items-center justify-center text-black font-extrabold cursor-pointer hover:bg-cyan-400 transition-colors'
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        {initials}
      </div>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700">
          <button
            onClick={handleProfileClick}
            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
          >
            <User className="mr-2 h-4 w-4" />
            Profile
          </button>
          <button
            onClick={handleLogoutClick}
            className="flex items-center px-4 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </button>
        </div>
      )}
    </div>
  )
}

export default Avatar