'use client';

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const PasswordInput = ({ id, name, label, value, onChange, error }) => {
    const [showPassword, setShowPassword] = useState(false);
    
    return (
      <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-2">
          {label}
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            className={`w-full px-4 py-3 border rounded-lg bg-gray-700 text-white pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
              error ? 'border-red-500' : 'border-gray-600'
            }`}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
        {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
      </div>
    );
 };
  
  export default PasswordInput;