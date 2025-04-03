import React from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import SubtaskItem from './SubtaskItem';

const SubtaskList = ({ subtasks,projectId,todoId ,userId,teamId, setisanyChange}) => {
  if (!subtasks || subtasks.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        No subtasks available. Add a subtask to get started.
      </div>
    );
  }
  const handleSubtaskUpdate = async (subtaskId, updatedData) => {
    try {
      const response = await axios.patch(`/api/teams/${teamId}/projects/${projectId}/todos/${todoId}/${subtaskId}`,updatedData);
      if(response.data.success){
        toast.success(response.data.message||" Subtask is updated successfully");
      }
      setisanyChange((prev)=>!prev)
    } catch (err) {
      console.error('Error updating subtask:', err);
      toast.error(err.response?.data?.message||"Something went wrong")
    }
  };
  
  const handleSubtaskDelete = async (subtaskId) => {
    try {
      const response = await axios.delete(`/api/teams/${teamId}/projects/${projectId}/todos/${todoId}/${subtaskId}`);
      if(response.data.success){
        toast.success(response.data.message||" Subtask is updated successfully");
      }
      setisanyChange((prev)=>!prev)
    } catch (err) {
      console.error('Error deleting subtask:', err);
      toast.error(err.response?.data?.message||"Something went wrong")
    }
  };
  
  return (
    <div className="space-y-4">
      {subtasks.map(subtask => (
        <SubtaskItem
          key={subtask._id} 
          subtask={subtask} 
          onUpdate={handleSubtaskUpdate}
          onDelete={handleSubtaskDelete}
          projectId={projectId}
          todoId={todoId}
          userId={userId}
          teamId={teamId}
        />
      ))}
    </div>
  );
};

export default SubtaskList;
