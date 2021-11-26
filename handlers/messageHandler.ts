import { pipe } from "fp-ts/function";
import { Either, fold } from "fp-ts/Either";
import { Server, Socket } from "socket.io";
import { messageValidate, userCheck, roomCheck, textCheck, datetimeCheck, Message } from "../validations/messageValidation";

const messageHandler = (io: Server, socket: Socket) => {
    const clientMessageInput = (message: Message, callback: (result: Object) => void) => {
        clientMessageProcess(message, io, messageValidate, failHandle, successHandle, callback);
    };
    socket.on("message:client", clientMessageInput);
};

const failHandle = (err: string, callback: (result: Object) => void) => {
    //console.log(`error: ${err}`);
    callback && callback({
        status: "Fail",
        error: err
    });
};

const successHandle = (io: Server, message: Message, callback: (result: Object) => void) => {
    io.emit("message:server", message);
    callback && callback({
        status: "Success"
    });
};

const clientMessageProcess = (message: Message, io: Server,
    messageValidate: (message: Message, userCheckFun: (message: Message) => Either<string, Message>,
        roomCheckFun: (message: Message) => Either<string, Message>,
        textCheckFun: (message: Message) => Either<string, Message>,
        datetimeCheckFun: (message: Message) => Either<string, Message>) => Either<string, Message>,
    failHandleFun: (err: string, callback: (result: Object) => void) => void,
    successHandleFun: (io: Server, message: Message, callback: (result: Object) => void) => void,
    callback: (result: Object) => void) => {
    pipe(
        messageValidate(message, userCheck, roomCheck, textCheck, datetimeCheck),
        fold(
            (error) => {
                failHandleFun(error, callback);
            },
            (message) => {
                successHandleFun(io, message, callback);
            }
        )
    );
};

export { messageHandler, failHandle, successHandle, clientMessageProcess };