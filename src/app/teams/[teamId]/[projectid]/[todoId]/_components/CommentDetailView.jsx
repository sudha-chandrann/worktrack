"use client";
import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {  X, Check, Edit2,  Trash } from "lucide-react";


function CommentDetailView({ 
  comments, 
  onEditComment, 
  onDeleteComment, 
  currentUserId 
}) {
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");

  // Handle empty comments case
  if (!comments || comments.length === 0) {
    return (
      <div className="py-6 text-gray-400 text-center bg-gray-900 rounded-lg border border-gray-800">
        <p>No comments yet. Be the first to add one!</p>
      </div>
    );
  }

  const handleEditClick = (comment) => {
    setEditingId(comment._id);
    setEditContent(comment.content);
  };

  const handleSaveEdit = (commentId) => {
    if (editContent.trim() && onEditComment) {
      onEditComment(commentId, editContent);
    }
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const isCommentOwner = (comment) => {
    return currentUserId && comment.author._id === currentUserId;
  };

  return (
    <div className="space-y-4 max-h-96 overflow-y-auto mb-4 pr-2 custom-scrollbar">
      {comments.map((comment) => (
        <div key={comment._id} className="bg-gray-900 p-4 rounded-md border border-gray-800 transition-all hover:border-gray-700">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium flex-shrink-0">
              {comment.author.fullName
                ? comment.author.fullName.charAt(0).toUpperCase()
                : comment.author.username
                ? comment.author.username.charAt(0).toUpperCase()
                : "?"}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-white">
                  {comment.author.fullName || comment.author.username}
                </span>
                <span className="text-xs text-gray-400">
                  {comment.createdAt
                    ? formatDistanceToNow(new Date(comment.createdAt), {
                        addSuffix: true,
                      })
                    : "Just now"}
                </span>
              </div>
              
              {editingId === comment._id ? (
                <div className="mb-2">
                  <textarea
                    className="w-full bg-gray-800 text-white border border-gray-700 rounded-md p-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={3}
                    autoFocus
                  />
                  <div className="flex justify-end mt-2 space-x-2">
                    <button 
                      onClick={handleCancelEdit}
                      className="flex items-center gap-1 px-3 py-1 text-xs bg-gray-800 text-gray-300 rounded hover:bg-gray-700 transition-colors"
                    >
                      <X size={14} />
                      Cancel
                    </button>
                    <button 
                      onClick={() => handleSaveEdit(comment._id)}
                      className="flex items-center gap-1 px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      <Check size={14} />
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-300 whitespace-pre-wrap">{comment.content}</p>
              )}
              
              {isCommentOwner(comment) && editingId !== comment._id && (
                <div className="flex justify-end mt-2">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleEditClick(comment)}
                      className="flex items-center gap-1 text-xs text-gray-400 hover:text-blue-400 transition-colors"
                      aria-label="Edit comment"
                    >
                      <Edit2 size={14} />
                      <span>Edit</span>
                    </button>
                    <button 
                      onClick={() => onDeleteComment && onDeleteComment(comment._id)}
                      className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-400 transition-colors"
                      aria-label="Delete comment"
                    >  
                      <Trash size={14} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default CommentDetailView;