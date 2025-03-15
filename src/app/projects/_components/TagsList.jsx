import React from "react";
import { Tag } from "lucide-react";

const TagsList = ({ tags }) => {
  if (!tags || tags.length === 0) return null;
  
  return (
    <div className="mt-6 bg-gray-750 rounded-lg p-4 border border-gray-700">
      <div className="flex items-center gap-2 mb-3">
        <Tag className="w-4 h-4 text-gray-400" />
        <h3 className="text-gray-200 font-medium">Tags</h3>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => {
          const tagName = tag.name || tag;
          // Generate a consistent pastel color based on tag name
          const getTagColor = (tagName) => {
            const colors = [
              'bg-blue-900/40 text-blue-300 border-blue-800/30',
              'bg-purple-900/40 text-purple-300 border-purple-800/30',
              'bg-green-900/40 text-green-300 border-green-800/30',
              'bg-amber-900/40 text-amber-300 border-amber-800/30',
              'bg-teal-900/40 text-teal-300 border-teal-800/30',
              'bg-pink-900/40 text-pink-300 border-pink-800/30'
            ];
            // Hash the tag name to pick a consistent color
            const hash = tagName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
            return colors[hash % colors.length];
          };
          
          return (
            <div 
              key={index} 
              className={`px-3 py-1.5 rounded-md text-sm font-medium border ${getTagColor(tagName)}`}
            >
              #{tagName}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TagsList;