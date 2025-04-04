"use client";
import React, { useEffect, useState } from "react";
import CommentDetailView from "./CommentDetailView";
import CommentInput from "./CommentInput";
import { toast } from "react-hot-toast";

function CommentView({ comments: initialComments, userId, todoId, teamId }) {
  const [comments, setComments] = useState(initialComments || []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("connecting");


  const handleSendComment = (commentContent) => {
    setIsSubmitting(true);
    try {
      console.log(" the content is ",commentContent);

    } catch (err) {
      toast.error("Failed to send comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-6 p-4 rounded bg-gray-800 shadow">
      <h3 className="text-white font-bold mb-4">Comments</h3>
      <CommentDetailView comments={comments} />
      <CommentInput onSubmit={handleSendComment} isSubmitting={isSubmitting} disabled={connectionStatus !== "connected"} />
    </div>
  );
}

export default CommentView;
