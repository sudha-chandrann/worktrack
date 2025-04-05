import React, { useState } from 'react';
import { UserCircle, AtSign, Mail, Save } from 'lucide-react';

const ProfileForm = ({ initialData, userData, onSubmit, onCancel, isSubmitting }) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username should be at least 3 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="fullName" className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
          <UserCircle className="h-4 w-4" />
          Full Name
        </label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleInputChange}
          className={`w-full px-4 py-3 border rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
            errors.fullName ? 'border-red-500' : 'border-gray-600'
          }`}
          placeholder="Enter your full name"
        />
        {errors.fullName && <p className="text-red-400 text-sm mt-1">{errors.fullName}</p>}
      </div>
      
      <div>
        <label htmlFor="username" className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
          <AtSign className="h-4 w-4" />
          Username
        </label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          className={`w-full px-4 py-3 border rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
            errors.username ? 'border-red-500' : 'border-gray-600'
          }`}
          placeholder="Enter your username"
        />
        {errors.username && <p className="text-red-400 text-sm mt-1">{errors.username}</p>}
      </div>
      
      <div>
        <label htmlFor="email" className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
          <Mail className="h-4 w-4" />
          Email
        </label>
        <input
          type="email"
          id="email"
          value={userData?.email}
          disabled
          className="w-full px-4 py-3 border border-gray-600 rounded-lg bg-gray-800 text-gray-400"
        />
        <p className="text-sm text-gray-500 mt-1 italic">Email cannot be changed</p>
      </div>
      
      <div className="flex justify-end space-x-4 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition-colors"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
          ) : (
            <Save size={18} />
          )}
          Save Changes
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;