import React from 'react';
import { Mail, Calendar, Folder, Users, Lock } from 'lucide-react';

const ProfileDisplay = ({ userData, onChangePassword }) => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-gray-700 p-2 rounded-lg">
                <Mail className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Email Address</p>
                <p className="text-white">{userData?.email}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="bg-gray-700 p-2 rounded-lg">
                <Calendar className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Member Since</p>
                <p className="text-white">{new Date(userData?.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-gray-700 p-2 rounded-lg">
                <Folder className="h-5 w-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Projects</p>
                <p className="text-white">{userData?.projects?.length || 0}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="bg-gray-700 p-2 rounded-lg">
                <Users className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Teams</p>
                <p className="text-white">{userData?.teams?.length || 0}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-6 mt-6">
          <button
            onClick={onChangePassword}
            className="flex items-center gap-2 px-5 py-2.5 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            <Lock size={18} />
            Change Password
          </button>
        </div>
      </div>
    );
  };
  
  export default ProfileDisplay;
  