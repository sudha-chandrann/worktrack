"use client";

import React, { useState, useEffect } from 'react';

const DailyCountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0); // Set to midnight (12 AM)
      
      const difference = tomorrow - now;
      
      // Calculate hours, minutes, seconds
      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      setTimeLeft({ hours, minutes, seconds });
    };

    // Calculate immediately and then set interval
    calculateTimeLeft();
    
    const timer = setInterval(calculateTimeLeft, 1000);
    
    // Clean up the interval on component unmount
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="max-w-md mx-auto  py-1 bg-transparent rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-1 text-gray-200">Time Left For Today</h1>
      
      <div className="flex justify-center items-center space-x-4 mt-2">
        <div className="flex flex-col items-center">
          <div className="text-xl font-bold bg-blue-600 text-white rounded-lg p-2 text-center">
            {timeLeft.hours.toString().padStart(2, '0')}
          </div>
          <p className="mt-2 text-gray-600 text-sm">Hours</p>
        </div>
        
        <div className="text-4xl font-bold  relative bottom-3 text-gray-200">:</div>
        
        <div className="flex flex-col items-center">
          <div className="text-xl font-bold bg-blue-600 text-white rounded-lg p-2 text-center">
            {timeLeft.minutes.toString().padStart(2, '0')}
          </div>
          <p className="mt-2 text-gray-600 text-sm">Minutes</p>
        </div>
        
        <div className="text-4xl font-bold relative bottom-3 text-gray-200">:</div>
        
        <div className="flex flex-col items-center">
          <div className="text-xl font-bold bg-blue-600 text-white rounded-lg p-2 text-center">
            {timeLeft.seconds.toString().padStart(2, '0')}
          </div>
          <p className="mt-2 text-gray-600 text-sm">Seconds</p>
        </div>
      </div>
    </div>
  );
};

export default DailyCountdownTimer;