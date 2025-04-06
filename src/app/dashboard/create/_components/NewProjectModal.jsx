"use client";

import {  XIcon } from "lucide-react";
import React, { useState, useEffect } from "react";

const EMOJI_OPTIONS = ["📝", "🚀", "💻", "📊", "🔍", "📱", "🌐", "⚙️", "📈", "🔒"];
const COLOR_OPTIONS = [
  { value: "#3498db", name: "Blue" },
  { value: "#e74c3c", name: "Red" },
  { value: "#2ecc71", name: "Green" },
  { value: "#f39c12", name: "Orange" },
  { value: "#9b59b6", name: "Purple" },
  { value: "#1abc9c", name: "Teal" },
  { value: "#34495e", name: "Dark" },
  { value: "#7f8c8d", name: "Gray" }
];

const NewProjectModal = ({ onSubmit, isSubmitting }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("📝");
  const [color, setColor] = useState("#3498db");
  const [isFormValid, setIsFormValid] = useState(false);
  
  const onClose = () => {
    setName("");
    setDescription("");
    setIcon("📝");
    setColor("#3498db");
    setIsFormValid(false);
  };

  // Validate form
  useEffect(() => {
    setIsFormValid(name.trim() !== "" && description.trim() !== "");
  }, [name, description]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    onSubmit({ name, description, icon, color });
  };

  return (
    <div className="flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg w-full max-w-md shadow-xl border border-gray-700">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">Create New Project</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <XIcon size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Project Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Project Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter project name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-700 text-white p-3 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              placeholder="Describe your project's purpose and goals"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-gray-700 text-white p-3 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent h-24 resize-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Icon Picker */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Project Icon</label>
              <div className="bg-gray-700 rounded-md border border-gray-600 p-2">
                <div className="flex items-center mb-2 bg-gray-800 rounded p-2 border border-gray-600">
                  <span className="text-2xl mr-2">{icon}</span>
                  <span className="text-sm text-gray-400">Selected Icon</span>
                </div>
                <div className="grid grid-cols-5 gap-1">
                  {EMOJI_OPTIONS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setIcon(emoji)}
                      className={`flex items-center justify-center h-8 w-8 rounded ${
                        icon === emoji ? "bg-gray-600 ring-2 ring-indigo-500" : "bg-gray-800 hover:bg-gray-700"
                      }`}
                    >
                      <span>{emoji}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Color Picker */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Project Color</label>
              <div className="bg-gray-700 rounded-md border border-gray-600 p-2">
                <div 
                  className="h-10 mb-2 rounded border border-gray-600"
                  style={{ backgroundColor: color }}
                />
                <div className="grid grid-cols-4 gap-1">
                  {COLOR_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setColor(option.value)}
                      className={`h-8 w-full rounded transition-all ${
                        color === option.value ? "ring-2 ring-white" : ""
                      }`}
                      style={{ backgroundColor: option.value }}
                      title={option.name}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {!isFormValid && (
            <div className="text-yellow-500 text-sm bg-yellow-500 bg-opacity-10 p-2 rounded flex items-center">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Please fill in all required fields marked with *
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition-colors font-medium"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              disabled={isSubmitting || !isFormValid}
            >
              {isSubmitting ? 
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </span> : 
                "Create Project"
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewProjectModal;