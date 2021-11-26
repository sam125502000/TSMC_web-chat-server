import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { io } from "socket.io-client";
import { failHandle, messageHandler, successHandle, clientMessageProcess } from "./messageHandler";

describe("Unit Test - messageHandler", () => {

    const message = {
        user: undefined,
        room: undefined,
        text: undefined,
        datetime: undefined
    };

    const mockChatServer = new Server();

    test("Fail Handle", () => {
        const error = "TestError";
        const mockCallBack = jest.fn();
        failHandle(error, mockCallBack);
        expect(mockCallBack).toHaveBeenCalled();
    });

    test("Success Handle", () => {

        const messageGood = {
            user: "test",
            room: "test",
            text: "test",
            datetime: 12345
        };

        const mockCallBack = jest.fn();
        const app = express();
        const httpServer = createServer(app);
        const mockSocket = new Server(httpServer, {
            cors: {
                origin: "http://localhost:4200",
                methods: ["GET", "POST"],
                credentials: true
            }
        });
        const mockSocketEmit = jest.spyOn(mockSocket, "emit");
        successHandle(mockSocket, messageGood, mockCallBack);
        expect(mockCallBack).toHaveBeenCalled();
        expect(mockSocketEmit).toHaveBeenCalledWith("message:server", messageGood);
    });

    test("Validation Success", () => {
        const returnGood = { "_tag": "Right", "right": message };
        const mockMessageValidateSuccess = jest.fn().mockReturnValue(returnGood);
        const mockSuccessHandle = jest.fn();
        clientMessageProcess(message, mockChatServer, mockMessageValidateSuccess, failHandle, mockSuccessHandle, (result: Object) => { });
        expect(mockSuccessHandle).toHaveBeenCalled();
    });

    test("Validation Fail", () => {
        const returnBad = { "_tag": "Left", "left": "test" };
        const mockMessageValidateFail = jest.fn().mockReturnValue(returnBad);
        const mockFailHandle = jest.fn();
        clientMessageProcess(message, mockChatServer, mockMessageValidateFail, mockFailHandle, successHandle, (result: Object) => { });
        expect(mockFailHandle).toHaveBeenCalled();
    });
});

describe("Integration Test - messageHandler", () => {

    const app = express();
    const httpServer = createServer(app);
    const chatServerValidation = new Server(httpServer, {
        cors: {
            origin: "http://localhost:4200",
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    const onConnectionValidation = (socket: Socket) => {
        messageHandler(chatServerValidation, socket);
    };

    chatServerValidation.on("connection", onConnectionValidation);
    chatServerValidation.listen(2222);

    const senderValidation = io("http://localhost:2222", { withCredentials: true });

    afterAll((done) => {
        chatServerValidation.close();
        senderValidation.disconnect();
        done();
    });

    test("Validation Input", (done) => {
        setTimeout(() => {
            senderValidation.emit("message:client", "test", () => { });
            setTimeout(() => { done(); }, 500);
        }, 500);
    });
});

