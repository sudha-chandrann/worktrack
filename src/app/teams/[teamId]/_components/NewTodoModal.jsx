'use client';
import { CalendarIcon, TagIcon, XIcon, UserIcon } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const NewTodoModal = ({ onClose, onSubmit, isSubmitting, members }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState(null);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  // Get today's date with time set to midnight for proper date comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Validate form whenever relevant fields change
  useEffect(() => {
    // Check if all required fields are filled
    const valid = 
      title.trim() !== '' && 
      description.trim() !== '' && 
      priority !== '' && 
      dueDate !== null &&
      assignedTo !== '';
    
    setIsFormValid(valid);
  }, [title, description, priority, dueDate, assignedTo]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!isFormValid) return;
    
    onSubmit({
      title,
      description,
      priority,
      dueDate,
      tags,
      assignedTo
    });
  };
  
  const handleAddTag = (e) => {
    e.preventDefault();
    if (!tagInput.trim()) return;
    
    setTags([...tags, tagInput.trim()]);
    setTagInput('');
  };
  
  const handleRemoveTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };
  
  const priorityOptions = [
    { value: 'high', label: 'High', color: 'bg-red-500' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-500' },
    { value: 'low', label: 'Low', color: 'bg-blue-500' }
  ];
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 overflow-hidden">
      <div className="bg-gray-800 rounded-lg w-full max-w-md max-h-full flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-lg font-medium text-white">New Task</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <XIcon className="w-5 h-5" />
          </button>
        </div>
        
        <div className="overflow-y-auto flex-grow">
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Task title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-gray-700 text-white p-3 rounded border border-gray-600 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-gray-700 text-white p-3 rounded border border-gray-600 focus:outline-none focus:border-indigo-500 h-24"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Priority <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                {priorityOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setPriority(option.value)}
                    className={`flex-1 p-2 rounded border ${
                      priority === option.value
                        ? `${option.color} text-white border-transparent`
                        : 'bg-gray-700 border-gray-600 text-gray-300'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Assigned To <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-3 text-gray-400">
                  <UserIcon className="w-5 h-5" />
                </div>
                <select
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  className="w-full bg-gray-700 text-white p-3 pl-10 rounded border border-gray-600 focus:outline-none focus:border-indigo-500 appearance-none"
                  required
                >
                  <option value="">Select a team member</option>
                  {members && members.map((member) => (
                    <option key={member.user._id} value={member.user._id}>
                      {member.user.fullName} ({member.role})
                    </option>
                  ))}
                </select>
              </div>
              {!assignedTo && (
                <p className="text-xs text-gray-400 mt-1">Please assign this task to someone</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Due Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-3 text-gray-400">
                  <CalendarIcon className="w-5 h-5" />
                </div>
                <DatePicker
                  selected={dueDate}
                  onChange={(date) => setDueDate(date)}
                  minDate={today}
                  className="w-full bg-gray-700 text-white p-3 pl-10 rounded border border-gray-600 focus:outline-none focus:border-indigo-500"
                  placeholderText="Select a due date"
                  dateFormat="MMMM d, yyyy"
                  popperClassName="react-datepicker-dark"
                  dayClassName={date => 
                    date < today ? "react-datepicker__day--disabled" : undefined
                  }
                  required
                />
              </div>
              {!dueDate && (
                <p className="text-xs text-gray-400 mt-1">Please select a due date</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">Tags (optional)</label>
              <div className="flex">
                <div className="relative flex-grow">
                  <div className="absolute left-3 top-3 text-gray-400">
                    <TagIcon className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    placeholder="Add a tag"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    className="w-full bg-gray-700 text-white p-3 pl-10 rounded-l border border-gray-600 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 rounded-r"
                >
                  Add
                </button>
              </div>
              
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag, index) => (
                    <div
                      key={index}
                      className="bg-gray-700 text-gray-300 px-2 py-1 rounded-full text-sm flex items-center gap-1"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(index)}
                        className="text-gray-400 hover:text-white"
                      >
                        <XIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {!isFormValid && (
              <div className="text-yellow-500 text-sm">
                Please fill in all required fields marked with *
              </div>
            )}
            
            <div className="flex justify-end gap-3 pt-2 border-t border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
                disabled={isSubmitting || !isFormValid}
              >
                {isSubmitting ? 'Adding...' : 'Add Task'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewTodoModal;