'use client';

import { SendHorizontalIcon } from 'lucide-react';
import React, { useState } from 'react';

function CommentInput({ onSubmit,isSubmitting, placeholder = 'Add a comment...' }) {
  const [commentContent, setCommentContent] = useState('');
  
  const handleSendComment = () => {
    if (!commentContent.trim()) return;
    
    if (onSubmit) {
      onSubmit(commentContent);
    } else {
      console.log(commentContent);
    }
    
    setCommentContent('');
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendComment();
    }
  };

  return (
    <div className="bg-gray-900 mt-2 rounded-full w-full flex items-center justify-between p-2 shadow-md">
      <input
        type="text"
        className="rounded-full bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none border px-4 py-2 w-full mr-2 border-gray-700 text-gray-900"
        value={commentContent}
        onChange={(e) => setCommentContent(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        aria-label="Comment input"
      />
      <button 
        className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        onClick={handleSendComment}
        disabled={!commentContent.trim()||isSubmitting}
        aria-label="Send comment"
      >
        <SendHorizontalIcon className="text-white w-5 h-5" />
      </button>
    </div>
  );
}

export default CommentInput;