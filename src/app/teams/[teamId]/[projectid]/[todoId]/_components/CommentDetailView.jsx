"use client";
import React from "react";
import { formatDistanceToNow } from "date-fns";

function CommentDetailView({ comments }) {
  if (!comments || comments.length === 0) {
    return (
      <div className="py-4 text-gray-400 text-center bg-gray-900 rounded-lg">
        No comments yet. Be the first to add one!
      </div>
    );
  }

  return (
    <div className="space-y-4 max-h-96 overflow-y-auto mb-4 pr-2">
      {comments.map((comment) => (
        <div key={comment._id} className="bg-gray-700 p-3 rounded-md">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
              {comment.author.fullName ? comment.author.fullName.charAt(0).toUpperCase() : 
               comment.author.username ? comment.author.username.charAt(0).toUpperCase() : '?'}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-white">
                  {comment.author.fullName || comment.author.username}
                </span>
                <span className="text-xs text-gray-400">
                  {comment.createdAt ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true }) : "Just now"}
                </span>
              </div>
              <p className="text-gray-300 text-sm">{comment.content}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default CommentDetailView;