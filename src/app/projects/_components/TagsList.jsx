// components/lists/TagsList.jsx
import React from "react";

const TagsList = ({ tags }) => {
  return (
    <div className="mt-4">
      <h3 className="text-lg font-medium mb-2">🏷️ Tags</h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <div key={index} className="bg-gray-700 px-3 py-1 rounded-md">
            #{tag.name || tag}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TagsList;