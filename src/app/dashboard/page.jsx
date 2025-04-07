"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { UserCircle, Edit, X } from 'lucide-react';
import ProfileForm from './_Components/ProfileForm';
import ProfileDisplay from './_Components/ProfileDisplay';
import PasswordChangeModal from './_Components/PasswordChangeModal';

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isSubmitting,setisSubmiting]= useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
  });
   
  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/api/profile');
      setUserData(response.data.data);
      setFormData({
        fullName: response.data.data.fullName,
        username: response.data.data.username,
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile information');
    } finally {
      setIsLoading(false);
    }
  };


     // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
        try {
          setIsLoading(true);
          const response = await axios.get('/api/profile');
          setUserData(response.data.data);
          setFormData({
            fullName: response.data.data.fullName,
            username: response.data.data.username,
          });
        } catch (error) {
          console.error('Error fetching profile:', error);
          toast.error('Failed to load profile information');
        } finally {
          setIsLoading(false);
        }
    };

    fetchUserProfile();
  }, []);

  // Handle profile update
  const handleProfileUpdate = async (updatedData) => {
    try {
      setisSubmiting(true);
      const response = await axios.patch('/api/profile', updatedData);
      setUserData(response.data.data);
      setIsEditing(false);
      fetchUserProfile();
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      if (error.response && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to update profile');
      }
      return false;
    }
    finally{
        setisSubmiting(false);
    }
    return true;
  };

  // Handle password change
  const handlePasswordChange = async (passwordData) => {
    try {
    setisSubmiting(true);
      await axios.post('/api/profile/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      
      setIsChangingPassword(false);
      toast.success('Password changed successfully');
      return true;
    } catch (error) {
      console.error('Error changing password:', error);
      if (error.response && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to change password');
      }
      return false;
    }
    finally{
        setisSubmiting(false);
    }
  };

  if (isLoading) {
    return(
        <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
    <div className="container mx-auto px-4 py-8 max-w-4xl">
    <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-32 md:h-48"></div>
      <div className="px-6 py-8 -mt-16 relative">
        <div className="flex flex-col md:flex-row md:items-end mb-6">
          <div className="flex-shrink-0 mb-4 md:mb-0">
            <div className="w-32 h-32 bg-gray-700 text-white rounded-full border-4 border-gray-800 flex items-center justify-center text-4xl shadow-lg">
              <UserCircle size={80} />
            </div>
          </div>
          <div className="md:ml-6 flex flex-col md:flex-row md:justify-between w-full items-start md:items-end">
            <div>
              <h1 className="text-3xl font-bold text-white mt-2">{userData.fullName}</h1>
              <p className="text-blue-300">@{userData.username}</p>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`mt-4 md:mt-0 px-6 py-2.5 rounded-lg flex items-center gap-2 transition-all text-white font-medium ${
                isEditing 
                  ? 'bg-gray-700 hover:bg-gray-600' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isEditing ? (
                <>
                  <X size={18} />
                  Cancel
                </>
              ) : (
                <>
                  <Edit size={18} />
                  Edit Profile
                </>
              )}
            </button>
          </div>
        </div>

        <div className="bg-gray-750 rounded-xl p-6 mt-6">
          {isEditing ? (
            <ProfileForm
              initialData={formData}
              userData={userData}
              onSubmit={handleProfileUpdate}
              onCancel={() => setIsEditing(false)}
              isSubmitting={isSubmitting}
            />
          ) : (
            <ProfileDisplay
              userData={userData}
              onChangePassword={() => setIsChangingPassword(true)}
            />
          )}
        </div>
      </div>
    </div>

    {isChangingPassword && (
      <PasswordChangeModal
        onSubmit={handlePasswordChange}
        onClose={() => setIsChangingPassword(false)}
        isSubmitting={isSubmitting}
      />
    )}
  </div>
  </div>
  
  );
};

export default ProfilePage;


  