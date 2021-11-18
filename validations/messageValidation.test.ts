import { messageValidate, userCheck, textCheck, datetimeCheck } from "./messageValidation";

describe("Unit Test - messageValidation", () => {
    test("Good message", () => {
        const messageGood = {
            user: "test",
            text: "test",
            datetime: 12345
        };
        const returnGood = { "_tag": "Right", "right": messageGood };
        expect(userCheck(messageGood)).toEqual(returnGood);
        expect(textCheck(messageGood)).toEqual(returnGood);
        expect(datetimeCheck(messageGood)).toEqual(returnGood);

        const mockUserCheck = jest.fn().mockReturnValue(returnGood);
        const mockTextCheck = jest.fn().mockReturnValue(returnGood);
        const mockDatetimeCheck = jest.fn().mockReturnValue(returnGood);
        expect(messageValidate(messageGood, mockUserCheck, mockTextCheck, mockDatetimeCheck)).toEqual(returnGood);
    });

    test("No user in message object.", () => {
        const messageNoUser = {
            user: undefined,
            text: "test",
            datetime: 12345
        };
        expect(userCheck(messageNoUser)).toEqual({ "_tag": "Left", "left": "Missing user in message object!" });
    });

    test("No text in message object.", () => {
        const messageNoText = {
            user: "test",
            text: undefined,
            datetime: 12345
        };
        expect(textCheck(messageNoText)).toEqual({ "_tag": "Left", "left": "Missing text in message object!" });
    });

    test("No datetime in message object.", () => {
        const messageNoDatetime = {
            user: "test",
            text: "test",
            datetime: undefined
        };
        expect(datetimeCheck(messageNoDatetime)).toEqual({ "_tag": "Left", "left": "Missing datetime in message object!" });
    });

    test("Illegal user value (space only)", () => {
        const messageUserOnlySpace = {
            user: "   ",
            text: "test",
            datetime: 12345
        };
        expect(userCheck(messageUserOnlySpace)).toEqual({ "_tag": "Left", "left": "user can not be empty (space only)!" });
    });

    test("Illegal text value (space only)", () => {
        const messageTextOnlySpace = {
            user: "test",
            text: "   ",
            datetime: 12345
        };
        expect(textCheck(messageTextOnlySpace)).toEqual({ "_tag": "Left", "left": "text can not be empty (space only)!" });
    });

    test("Illegal datetime value (negative)", () => {
        const messageDatetimeNegative = {
            user: "test",
            text: "test",
            datetime: -12345
        };
        expect(datetimeCheck(messageDatetimeNegative)).toEqual({ "_tag": "Left", "left": "datetime can not be negative!" });
    });
});