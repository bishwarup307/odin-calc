const evaluateStack = require("./index");
// import evaluateStack from "./index.js";

describe("evaluateStack", () => {
    test("7 sign", () => {
        expect(JSON.stringify(evaluateStack([7, "sign"]))).toBe(
            JSON.stringify([-7])
        );
    });

    test("-7 sign", () => {
        expect(JSON.stringify(evaluateStack([-7, "sign"]))).toBe(
            JSON.stringify([7])
        );
    });

    test("7 + sign", () => {
        expect(JSON.stringify(evaluateStack([7, "plus", "sign"]))).toBe(
            JSON.stringify([-7, "plus"])
        );
    });

    test("7 + 3 sign", () => {
        expect(JSON.stringify(evaluateStack([7, "plus", 3, "sign"]))).toBe(
            JSON.stringify([7, "plus", -3])
        );
    });

    test("6 + ", () => {
        expect(JSON.stringify(evaluateStack([6, "plus"]))).toBe(
            JSON.stringify([6, "plus"])
        );
    });

    test("6 + -", () => {
        expect(JSON.stringify(evaluateStack([6, "plus", "minus"]))).toBe(
            JSON.stringify([6, "minus"])
        );
    });

    test("+ 6 10 -", () => {
        expect(JSON.stringify(evaluateStack(["plus", 6, 10, "minus"]))).toBe(
            JSON.stringify([10, "minus"])
        );
    });

    test("6 10 - *", () => {
        expect(
            JSON.stringify(evaluateStack([6, 10, "minus", "multiply"]))
        ).toBe(JSON.stringify([10, "multiply"]));
    });

    test("6 7 8 /", () => {
        expect(JSON.stringify(evaluateStack([6, 7, 8, "divide"]))).toBe(
            JSON.stringify([8, "divide"])
        );
    });

    test("6 - 10 +", () => {
        expect(JSON.stringify(evaluateStack([6, "minus", 10, "plus"]))).toBe(
            JSON.stringify([-4, "plus"])
        );
    });

    test("5 / 2 *", () => {
        expect(
            JSON.stringify(evaluateStack([5, "divide", -2, "multiply"]))
        ).toBe(JSON.stringify([-2.5, "multiply"]));
    });

    test("1.3 + 2.2 /", () => {
        expect(
            JSON.stringify(evaluateStack([1.3, "plus", 2.2, "divide"]))
        ).toBe(JSON.stringify([3.5, "divide"]));
    });

    test("1.3 + 2.2 =", () => {
        expect(JSON.stringify(evaluateStack([1.3, "plus", 2.2, "equal"]))).toBe(
            JSON.stringify([3.5])
        );
    });

    test("10 + =", () => {
        expect(JSON.stringify(evaluateStack([10, "plus", "equal"]))).toBe(
            JSON.stringify([20])
        );
    });
});
