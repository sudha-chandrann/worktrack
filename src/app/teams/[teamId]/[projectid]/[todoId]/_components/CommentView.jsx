// CommentView.jsx
"use client";
import React, { useEffect, useState } from "react";
import CommentDetailView from "./CommentDetailView";
import CommentInput from "./CommentInput";
import { toast } from "react-hot-toast";
import {
  getSocket,
  initializeSocket,
  joinRooms,
} from "../../../../../../socket";

function CommentView({ comments: initialComments, userId, todoId, teamId }) {
  const [comments, setComments] = useState(initialComments || []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState("connecting");

  useEffect(() => {
    const socket = initializeSocket();

    // Join rooms for real-time updates
    joinRooms(userId, teamId);

    const handleConnect = () => {
      setStatus("connected");
    };

    const handleDisconnect = () => {
      setStatus("disconnected");
    };

    const handleNewComment = (data) => {
      if (data.success && data.todoId === todoId) {
        setComments((prevComments) => {
          // Check if comment already exists to prevent duplicates
          const exists = prevComments.some(
            (comment) => comment._id === data.comment._id
          );
          if (exists) {
            return prevComments;
          }
          return [...prevComments, data.comment];
        });
        toast.success("New comment added!");
      }
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("commenttodoAdded", handleNewComment);
    socket.on("error", (error) => {
      toast.error(error.message || "Something went wrong!");
    });

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("commenttodoAdded", handleNewComment);
      socket.off("error");
    };
  }, [userId, teamId, todoId]);

  const handleSendComment = (commentContent) => {
    setIsSubmitting(true);
    try {
      const socket = getSocket();
      socket.emit("addCommentToTodo", {
        todoId,
        comment: commentContent,
        teamId,
        userId,
      });
      // Comment will be added when we receive the commenttodoAdded event
    } catch (err) {
      toast.error("Failed to send comment");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="text-sm text-gray-500">
        Connection Status:{" "}
        <span
          className={
            status === "connected"
              ? "text-green-500 font-medium"
              : "text-red-500 font-medium"
          }
        >
          {status}
        </span>
      </div>

      <div className="bg-gray-800 rounded-lg shadow p-4">
        <h2 className="text-lg font-medium mb-4 text-white">
          Comments 
        </h2>

        <CommentDetailView comments={comments} currentUserId={userId} />

        <CommentInput
          onSubmit={handleSendComment}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}

export default CommentView;
