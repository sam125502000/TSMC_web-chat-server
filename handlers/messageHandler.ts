import { pipe } from "fp-ts/function";
import { Either, fold } from "fp-ts/Either";
import { Server, Socket } from "socket.io";
import { userCheck, textCheck, datetimeCheck, Message } from "../validations/messageValidation";

const messageHandler = (io: Server, socket: Socket, messageValidate: (m: Message, userCheckFun: (m: Message) => Either<string, Message>, textCheckFun: (m: Message) => Either<string, Message>, datetimeCheckFun: (m: Message) => Either<string, Message>) => Either<string, Message>) => {
    socket.on("message:client", (message: Message, callback: (result: Object) => void) => {
        pipe(
            messageValidate(message, userCheck, textCheck, datetimeCheck),
            fold(
                (error) => {
                    failHandle(error, callback);
                },
                (message) => {
                    successHandle(io, message, callback);
                }
            )
        );
    });
};

const failHandle = (err: string, callback: (result: Object) => void) => {
    //console.log(`error: ${err}`);
    callback({
        status: "Fail",
        error: err
    });
};

const successHandle = (io: Server, message: Message, callback: (result: Object) => void) => {
    io.emit("message:server", message);
    callback({
        status: "Success"
    });
};

export { messageHandler, failHandle, successHandle };