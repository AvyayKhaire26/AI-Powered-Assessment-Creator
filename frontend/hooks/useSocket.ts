"use client";
import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

type SocketEvents = {
  "paper:ready": (data: { assignmentId: string }) => void;
  "paper:failed": (data: { assignmentId: string; reason: string }) => void;
  "pdf:ready": (data: { assignmentId: string; pdfUrl: string }) => void;
};

export function useSocket(
  assignmentId: string | null,
  handlers: Partial<SocketEvents>
) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!assignmentId) return;

    const socket = io(process.env.NEXT_PUBLIC_WS_URL!, { transports: ["websocket"] });
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("join:assignment", assignmentId);
    });

    if (handlers["paper:ready"]) socket.on("paper:ready", handlers["paper:ready"]);
    if (handlers["paper:failed"]) socket.on("paper:failed", handlers["paper:failed"]);
    if (handlers["pdf:ready"]) socket.on("pdf:ready", handlers["pdf:ready"]);

    return () => {
      socket.disconnect();
    };
  }, [assignmentId]);
}
