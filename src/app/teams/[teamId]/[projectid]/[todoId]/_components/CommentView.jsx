// CommentView.jsx
"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  getSocket,
  initializeSocket,
  joinRooms,
} from "../../../../../../socket"
import CommentDetailView from "./CommentDetailView";
import CommentInput from "./CommentInput";

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
          return [ data.comment,...prevComments];
        });
      }
    };
    const handleEditComment = (data) => {
      if (data.success && data.todoId === todoId) {
        setComments((prevComments) => {
          return prevComments.map((comment) => {
            if (comment._id === data.comment._id) {
              return data.comment;
            }
            return comment;
          });
        });
      }
    };
    const handleCommentDeleted = (data) => {
      if (data.success && data.todoId === todoId) {
        // Remove the deleted comment from state
        setComments((prevComments) => 
          prevComments.filter(comment => comment._id !== data.commentId)
        );
        
      }
    };
    

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("commenttodoAdded", handleNewComment);
    socket.on("todoCommentEdited", handleEditComment);
    socket.on("todoCommentDeleted", handleCommentDeleted);
    socket.on("TodocommentEditSuccess",(data)=>{
      toast.success(data.message);
    })
    socket.on("commentDeleteSuccess",(data)=>{
      toast.success(data.message);
    })
    socket.on("error", (error) => {
      toast.error(error.message || "Something went wrong!");
    });

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("commenttodoAdded", handleNewComment);
      socket.off("todoCommentEdited", handleEditComment);
      socket.off("todoCommentDeleted", handleCommentDeleted);
      socket.off("TodocommentEditSuccess")
      socket.off("commentDeleteSuccess")
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

  const handleCommentEdit=(commentId,editContent)=>{
    setIsSubmitting(true);
    try {
      const socket = getSocket();
      socket.emit("editTodoComment", {
        todoId, editContent, teamId, userId, commentId
      })
    }
    catch (err) {
      toast.error("Failed to edit comment");
    }
    finally{
      setIsSubmitting(false);
    }
  }
  const handleCommentDelete = (commentId) => {

      try {
        const socket = getSocket();
        socket.emit("deleteTodoComment", {
          todoId: todoId,       
          teamId: teamId,  
          userId:userId ,
          commentId: commentId
        });
      }
      catch (err) {
        toast.error("Failed to edit comment");
      }

    
  };
  


  return (
    <div className="flex flex-col space-y-4">

      <div className="bg-gray-800 rounded-lg shadow p-4">
        <h2 className="text-lg font-medium mb-4 text-white">
          Comments 
        </h2>

        <CommentDetailView comments={comments} currentUserId={userId} onEditComment={handleCommentEdit} onDeleteComment={handleCommentDelete} />

        <CommentInput
          onSubmit={handleSendComment}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}

export default CommentView;
