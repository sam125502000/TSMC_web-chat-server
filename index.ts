import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { messageHandler } from "./handlers/messageHandler";

const serverStart = (port: number): Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap> => {
  const app = express();
  const httpServer = createServer(app);
  const chatServer = new Server(httpServer, {
    cors: {
      origin: "http://localhost:4200",
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  const onConnection = (socket: Socket) => {
    //console.log("user connected");
    messageHandler(chatServer, socket);
    chatServer.to(socket.id).emit('connection', 'connected');
  };

  chatServer.on("connection", onConnection);
  chatServer.listen(port);

  return chatServer;
};

serverStart(5566);

export { serverStart }