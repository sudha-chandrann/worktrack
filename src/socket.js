// socket.js
import { io } from "socket.io-client";

let socket;

export const initializeSocket = () => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_BACKEND_URL, {
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log(" Connected to socket:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log(" Socket disconnected");
    });

    socket.on("connect_error", (err) => {
      console.error("Connection error:", err);
    });
  }

  return socket;
};

export const getSocket = () => {
  return socket || initializeSocket();
};

export const joinRooms = (userId, teamId) => {
    const socket = getSocket();
    if (userId) {
      socket.emit("joinUserRoom", userId);
    }
    if (teamId) {
      socket.emit("joinTeamRoom", teamId);
    }
};


export const disconnectSocket = () => {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
};