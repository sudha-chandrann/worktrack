import React from 'react';
import SubtaskItem from './SubtaskItem';

const SubtaskList = ({ subtasks,projectId,todoId }) => {
  if (!subtasks || subtasks.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        No subtasks available. Add a subtask to get started.
      </div>
    );
  }
  const handleSubtaskUpdate = async (subtaskId, updatedData) => {
    try {
      const response = await fetch(`/api/subtasks/${subtaskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update subtask');
      }
      
      // Refresh todo data to include updated subtask
      const refreshResponse = await fetch(`/api/todos/${todoId}`);
      const refreshData = await refreshResponse.json();
      setTodo(refreshData.todo);
    } catch (err) {
      console.error('Error updating subtask:', err);
      setError(err.message);
    }
  };
  
  const handleSubtaskDelete = async (subtaskId) => {
    try {
      const response = await fetch(`/api/subtasks/${subtaskId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete subtask');
      }
      
      // Refresh todo data
      const refreshResponse = await fetch(`/api/todos/${todoId}`);
      const refreshData = await refreshResponse.json();
      setTodo(refreshData.todo);
    } catch (err) {
      console.error('Error deleting subtask:', err);
      setError(err.message);
    }
  };
  
  return (
    <div className="space-y-4">
      {subtasks.map(subtask => (
        <SubtaskItem 
          key={subtask._id} 
          subtask={subtask} 
          onUpdate={handleSubtaskUpdate}
          onDelete={handleSubtaskUpdate}
          projectId={projectId}
          todoId={todoId}
        />
      ))}
    </div>
  );
};

export default SubtaskList;
