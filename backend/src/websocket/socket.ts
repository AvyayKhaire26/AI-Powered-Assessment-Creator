import { Server as HttpServer } from "http";
import { Server as SocketServer, Socket } from "socket.io";
import { env } from "../config/env";
import { logger } from "../utils/logger";

let io: SocketServer;

export function initSocket(httpServer: HttpServer): SocketServer {
    logger.info("Inside initSocket()");

    io = new SocketServer(httpServer, {
        cors: {
            origin: env.CLIENT_URL,
            methods: ["GET", "POST"],
        },
    });

    io.on("connection", (socket: Socket) => {
        logger.info(`Socket connected: ${socket.id}`);

        socket.on("join:assignment", (assignmentId: string) => {
            socket.join(assignmentId);
            logger.info(`Socket ${socket.id} joined room: ${assignmentId}`);
        });

        socket.on("disconnect", () => {
            logger.info(`Socket disconnected: ${socket.id}`);
        });
    });

    logger.info("End of initSocket()");
    return io;
}

export function getIO(): SocketServer {
    if (!io) throw new Error("Socket.io not initialized");
    return io;
}
