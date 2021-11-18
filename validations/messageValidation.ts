import { pipe } from "fp-ts/function";
import { Either, left, right, chain } from "fp-ts/Either";

type Message = {
    user: string | undefined
    text: string | undefined
    datetime: number | undefined
};

const userCheck = (m: Message): Either<string, Message> =>
    m.user ? m.user.trim().length > 0 ? right(m) : left("user can not be empty (space only)!") : left("Missing user in message object!");

const textCheck = (m: Message): Either<string, Message> =>
    m.text ? m.text.trim().length > 0 ? right(m) : left("text can not be empty (space only)!") : left("Missing text in message object!");

const datetimeCheck = (m: Message): Either<string, Message> =>
    m.datetime ? m.datetime >= 0 ? right(m) : left("datetime can not be negative!") : left("Missing datetime in message object!");

const messageValidate = (m: Message, userCheckFun: (m: Message) => Either<string, Message>, textCheckFun: (m: Message) => Either<string, Message>, datetimeCheckFun: (m: Message) => Either<string, Message>): Either<string, Message> =>
    pipe(
        userCheckFun(m),
        chain(textCheckFun),
        chain(datetimeCheckFun)
    );

export { messageValidate, userCheck, textCheck, datetimeCheck, Message }