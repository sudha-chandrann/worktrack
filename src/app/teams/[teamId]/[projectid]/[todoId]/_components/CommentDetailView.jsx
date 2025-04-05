"use client";
import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { X, Check, Edit2, Trash } from "lucide-react";
import AlertBox from "../../../../../_components/AlertBox";

function CommentDetailView({ 
  comments, 
  onEditComment, 
  onDeleteComment, 
  currentUserId 
}) {
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");

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
    setEditContent("");
  };

  const isCommentOwner = (comment) => {
    return currentUserId && comment.author._id === currentUserId;
  };

  const handleCommentDelete = (commentId) => {
    onDeleteComment(commentId);
  };

  // Format timestamp with indicator if edited
  const formatTimestamp = (comment) => {
    if (!comment.createdAt) return "Just now";
    
    // Show "edited" label and updatedAt time if the comment was edited
    if (comment.updatedAt && new Date(comment.updatedAt) > new Date(comment.createdAt)) {
      return `Edited ${formatDistanceToNow(new Date(comment.updatedAt), { addSuffix: true })}`;
    }
    
    // Otherwise show created time
    return formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true });
  };

  // Handle empty comments case
  if (!comments || comments.length === 0) {
    return (
      <div className="py-6 text-gray-400 text-center bg-gray-900 rounded-lg border border-gray-800">
        <p>No comments yet. Be the first to add one!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-h-96 overflow-y-auto mb-4 pr-2 custom-scrollbar">
      {comments.map((comment) => (
        <div key={comment._id} className="bg-gray-900 p-4 rounded-md border border-gray-800 transition-all hover:border-gray-700">
          <div className="flex items-start gap-3">
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium flex-shrink-0">
              {comment.author.fullName
                ? comment.author.fullName.charAt(0).toUpperCase()
                : comment.author.username
                ? comment.author.username.charAt(0).toUpperCase()
                : "?"}
            </div>
            
            {/* Comment content */}
            <div className="flex-1">
              {/* Author and timestamp */}
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-white">
                  {comment.author.fullName || comment.author.username}
                </span>
                <span className="text-xs text-gray-400">
                  {formatTimestamp(comment)}
                </span>
              </div>
              
              {/* Edit mode */}
              {editingId === comment._id ? (
                <div className="mb-2">
                  <textarea
                    className="w-full bg-gray-800 text-white border border-gray-700 rounded-md p-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={3}
                    autoFocus
                    placeholder="Edit your comment..."
                  />
                  <div className="flex justify-end mt-2 space-x-2">
                    <button 
                      onClick={handleCancelEdit}
                      className="flex items-center gap-1 px-3 py-1 text-xs bg-gray-800 text-gray-300 rounded hover:bg-gray-700 transition-colors"
                      aria-label="Cancel edit"
                    >
                      <X size={14} />
                      Cancel
                    </button>
                    <button 
                      onClick={() => handleSaveEdit(comment._id)}
                      className="flex items-center gap-1 px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                      disabled={!editContent.trim()}
                      aria-label="Save edit"
                    >
                      <Check size={14} />
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                // Display mode
                <p className="text-gray-300 whitespace-pre-wrap break-words">{comment.content}</p>
              )}
              
              {/* Action buttons for comment owner */}
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
                    <AlertBox onConfirm={() => handleCommentDelete(comment._id)}>
                      <button 
                        className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-400 transition-colors"
                        aria-label="Delete comment"
                      >  
                        <Trash size={14} />
                        <span>Delete</span>
                      </button>
                    </AlertBox>
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