import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { io } from "socket.io-client";
import { failHandle, messageHandler, successHandle } from "./messageHandler";

describe("Unit Test - messageHandler", () => {

    test("Fail Handle", () => {
        const error = "TestError";
        const mockCallBack = jest.fn();
        failHandle(error, mockCallBack);
        expect(mockCallBack).toHaveBeenCalled();
    });

    test("Success Handle", () => {
        const messageGood = {
            user: "test",
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
});

describe("Integration Test - messageHandler", () => {

    const app = express();
    const httpServer = createServer(app);
    const chatServerValidationPass = new Server(httpServer, {
        cors: {
            origin: "http://localhost:4200",
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    const messageGood = {
        user: "test",
        text: "test",
        datetime: 12345
    };
    const returnGood = { "_tag": "Right", "right": messageGood };
    const mockMessageValidatePass = jest.fn().mockReturnValue(returnGood);

    const onConnectionValidationPass = (socket: Socket) => {
        messageHandler(chatServerValidationPass, socket, mockMessageValidatePass);
    };

    chatServerValidationPass.on("connection", onConnectionValidationPass);
    chatServerValidationPass.listen(2222);

    const chatServerValidationFail = new Server(httpServer, {
        cors: {
            origin: "http://localhost:4200",
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    const returnBad = { "_tag": "Left", "left": "test" };
    const mockMessageValidateFail = jest.fn().mockReturnValue(returnBad);

    const onConnectionValidationFail = (socket: Socket) => {
        messageHandler(chatServerValidationFail, socket, mockMessageValidateFail);
    };

    chatServerValidationFail.on("connection", onConnectionValidationFail);
    chatServerValidationFail.listen(3333);

    const senderValidationPass = io("http://localhost:2222", { withCredentials: true });
    const receiverValidationPass = io("http://localhost:2222", { withCredentials: true });
    const senderValidationFail = io("http://localhost:3333", { withCredentials: true });
    const receiverValidationFail = io("http://localhost:3333", { withCredentials: true });

    afterAll((done) => {
        chatServerValidationPass.close();
        chatServerValidationFail.close();
        senderValidationPass.disconnect();
        receiverValidationPass.disconnect();
        senderValidationFail.disconnect();
        receiverValidationFail.disconnect();
        done();
    });

    test("Validation Pass", (done) => {
        receiverValidationPass.on("message:server", () => {
        });
        setTimeout(() => {
            senderValidationPass.emit("message:client", "test", () => {
                done();
            });
        }, 500);
    });

    test("Validation Fail", (done) => {
        receiverValidationFail.on("message:server", () => {
        });
        setTimeout(() => {
            senderValidationFail.emit("message:client", "test", () => {
                done();
            });
        }, 500);
    });
});

