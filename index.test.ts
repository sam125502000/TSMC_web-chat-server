
import { io } from "socket.io-client";
import { serverStart } from "./index";

describe("Integration Test - index", () => {

    const chatServer = serverStart(1111);

    afterAll(() => {
        chatServer.close();
    });

    test("User connected", (done) => {
        setTimeout(() => {
            const clientSocket = io("http://localhost:1111", { withCredentials: true });
            setTimeout(() => {
                clientSocket.disconnect();
                done();
            }, 500);
        }, 500);
    });
});

