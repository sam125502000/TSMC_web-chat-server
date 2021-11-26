import { pipe } from "fp-ts/function";
import { Either, left, right, chain } from "fp-ts/Either";

type Message = {
    user: string | undefined
    room: string | undefined
    text: string | undefined
    datetime: number | undefined
};

const userCheck = (message: Message): Either<string, Message> =>
    message.user ? message.user.trim().length > 0 ? right(message) : left("user can not be empty (space only)!") : left("Missing user in message object!");

const roomCheck = (message: Message): Either<string, Message> =>
    message.room ? message.room.trim().length > 0 ? right(message) : left("room can not be empty (space only)!") : left("Missing room in message object!");

const textCheck = (message: Message): Either<string, Message> =>
    message.text ? message.text.trim().length > 0 ? right(message) : left("text can not be empty (space only)!") : left("Missing text in message object!");

const datetimeCheck = (message: Message): Either<string, Message> =>
    message.datetime ? message.datetime >= 0 ? right(message) : left("datetime can not be negative!") : left("Missing datetime in message object!");

const messageValidate = (message: Message, userCheckFun: (message: Message) => Either<string, Message>, roomCheckFun: (message: Message) => Either<string, Message>, textCheckFun: (message: Message) => Either<string, Message>, datetimeCheckFun: (message: Message) => Either<string, Message>): Either<string, Message> =>
    pipe(
        userCheckFun(message),
        chain(roomCheckFun),
        chain(textCheckFun),
        chain(datetimeCheckFun)
    );

export { messageValidate, userCheck, roomCheck, textCheck, datetimeCheck, Message }