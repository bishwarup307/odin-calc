const DIVIDE_TEXT = "&#xF7";
const MULTIPLY_TEXT = "&times";

const keysContainer = document.querySelector(".keys-container");
const display = document.querySelector(".display-container");
const liveCalc = document.querySelector(".calc");

let firstNumber = 0;
let secondNumber;
let operands = [];

const SYMBOLS = [
    { text: "AC", id: "ac" },
    { text: "+/-", id: "sign" },
    { text: "%", id: "percent" },
    { text: DIVIDE_TEXT, id: "divide" },
    { text: 7 },
    { text: 8 },
    { text: 9 },
    { text: MULTIPLY_TEXT, id: "multiply" },
    { text: 4 },
    { text: 5 },
    { text: 6 },
    { text: "-", id: "minus" },
    { text: 1 },
    { text: 2 },
    { text: 3 },
    { text: "+", id: "plus" },
    { text: 0 },
    { text: ".", id: "decimal" },
    { text: "=", id: "equal" },
];

const OPERATORS = ["plus", "minus", "multiply", "divide", "equal"];
const OTHERS = ["ac", "sign", "percent"];

function findDisplayText(keyId) {
    const id = keyId.split("-")[1];
    assignedKey = SYMBOLS.find((item) => item.id === id);
    return assignedKey.text;
}

const notNull = (item) => item || item === 0;
const applySign = (state) => {
    if (notNull(state.second)) state;
};

const isNumber = (item) => notNull(parseFloat(item));
const isOperand = (item) =>
    ["plus", "minus", "multiply", "divide", "equal"].includes(item);

/*
We handle the logic using some form of a stack. The idea is to 
1. Hold user's input in a buffer
2. Keep the buffer on while the user presses a number key
3. Every time an operand key is pressed:
    a. push the key to the stack
    b. evaluate the stack

We look at the top of the stack and resolve the expression at the top.


*/

const evaluateStack = function (stack) {
    let newStack;

    /*
        Every time an operand key is pressed, an evaluation of the stack
        is triggered. We extract which operand key was pressed by the user and
        do necessary calculation on the stack and return in back for further inputs.

        There are two types of operand keys - which immediately looks at the history
        and perform the calculations. For example, when the user presses '+'/'-'/'x'/'/'/'='
        keys that should trigger a calculation on upto last three elements in the stack.
        In such cases these operands are carried forward and waits for further input from the
        user to be operated. For example, consider this series of keys ['11', '-', '6', '+'].
        When the '-' and '+' keys are pressed they are not removed from the stack as they are
        forward looking operators that expect a "next" number to be functional. so the stack above
        should resolve into ['5', '+']. Note that we still keep the last operand in the stack.

        A not so well known behavior of the '=' key is when it's pressed after another operand e.g.,
        '+', '-' etc. In this case it will take the number to the immediate left of the preceding operand
        and consider it as both the first and second element for that operation. Let's see a few examples
        to make this clear:
        `6 + =` => 12
        `6 * =` => 36
        `6 /=`  => 1
        `6 -=`  => 0

        On the other hand, there are keys like sign('+/-') and percent('%') that does not
        warrant an evaluation in that sense. Rather it just looks at the last number, performs the
        necessary calculation and returns the stack as is. In the above example if the user had
        pressed a 'sign' key instead of '+' at the end the stack before evaluation would become
        ['11', '-', '6', 'sign'] and the resulting stack should then be ['11', '-', '-6']. Note
        the difference. Firstly, the previous elements ('11' and '-') are still waiting for an
        operation. Secondly, the last operand 'sign' is instantly neutralized on '6' making it '-6'.
        
        Another peculiar behavior of the sign button is this: say we have a stack like ['10', '+', 'sign'].
        In this case the sign will get more priority. It will be move over to the left and make the stack
        ['-10', '+']. Note that the '+' is still pending in the stack and does NOT get removed.

        Let's implement this behavior step by step below.
    */
    let currentOp = stack.pop(); // Extract the last key (operand) and remove it from the stack

    // Let's first handle the latter case
    // debugger;
    if (currentOp === "sign") {
        newStack = stack.slice(); // make a copy of the actual stack

        /*
            we will keep popping the last element of the stack until we get a number.
            we shall keep track of the elements being popped as they need to be put back
            in the stack. If you are confused please read the description above on behavior
            of the 'sign' operator.
        */
        toBeAppended = [];
        while (true) {
            lastElem = newStack.pop();
            if (isNumber(lastElem)) {
                toBeAppended.unshift(lastElem * -1); // unshift to preserve the order
                break;
            } else toBeAppended.unshift(lastElem);
        }
        newStack = [...newStack, ...toBeAppended];
        return newStack;
    }

    let history = stack.slice(-3);
    switch (history.length) {
        case 1:
            newStack = history.slice();
            break;

        // Two possibilities - [number, op] or [number, number]
        // we can ignore the previous numbers in a series of
        // consecutive numbers
        case 2:
            if (currentOp === "equal") {
                if (isOperand(history[1]))
                    newStack = [calculate(history[0], history[0], history[1])];
            } else
                newStack = notNull(parseFloat(history[1]))
                    ? [history[1]]
                    : [history[0]];
            break;

        /*
            Four possibilities here
            1. [number, number, number] 
                 this could be done through repeatedly pressing the sign button.
                 Just return the last number as the new stack as there are no
                 operands in between them.
            2. [number, number, op]
                Here the first number is irrelevant. Just return the second number.
                the op at the end is also irrelevant as that will be replaced
                by the op that we extracted before
            3. [op, number, number]
                Similar logic applies here. We can ignore the op and the second number
                and return the last number.
            4. [number, op, number]
                This is a valid calculation stack. so we apply the operation and the
                new stack will only contain the result of the operation
            */
        case 3:
            if (
                isNumber(history[0]) &&
                isNumber(history[1]) &&
                isNumber(history[2])
            )
                newStack = [history[2]];
            else if (
                isNumber(history[0]) &&
                isNumber(history[1]) &&
                isOperand(history[2])
            )
                newStack = [history[1]];
            else if (
                isOperand(history[0]) &&
                isNumber(history[1]) &&
                isNumber(history[2])
            )
                newStack = [history[2]];
            else {
                let result = calculate(history[0], history[2], history[1]);
                newStack = [result];
            }
            break;
    }

    if (currentOp !== "equal") newStack.push(currentOp);
    return newStack;
};

const calculate = function (num1, num2, op) {
    {
        switch (op) {
            case "plus":
                return num1 + num2;

            case "minus":
                return num1 - num2;

            case "multiply":
                return num1 * num2;

            case "divide":
                if (num2 === 0) {
                    alert("Ugly baby judges you!");
                    return;
                }
                return num1 / num2;
        }
    }
};

// console.log(evaluateStack([7, "sign"]));
module.exports = evaluateStack;

// // Builds the keys on the calculator
// function makeKeyGrid() {
//     const placeHolder = document.createDocumentFragment();

//     SYMBOLS.forEach((symbol) => {
//         key = document.createElement("div");
//         key.innerHTML = symbol.text;
//         key.classList.add("key");
//         if (!symbol.id) {
//             key.classList.add("number-key");
//             symbol.id = `${symbol.text}`;
//         }

//         if (symbol.id === "decimal") key.classList.add("number-key");

//         if (OPERATORS.includes(symbol.id)) key.classList.add("operator-key");
//         if (OTHERS.includes(symbol.id)) key.classList.add("other-key");

//         key.id = `key-${symbol.id}`;
//         if (symbol.text === 0) key.classList.add("zero-key");
//         placeHolder.appendChild(key);
//     });

//     keysContainer.appendChild(placeHolder);
// }

// function keyDownEffect(event) {
//     event.target.style.opacity = 0.6;
// }

// function keyUpEffect(event) {
//     setTimeout(() => (event.target.style.opacity = 1), 90);
// }

// makeKeyGrid();

// // We are assigning keyboard keys to the buttons to make
// // user able to type their expression in addition to
// // clicking the key buttons
// keysContainer.addEventListener("click", keyDownEffect);
// keysContainer.addEventListener("click", keyUpEffect);

// window.addEventListener("keyup", (event) => {
//     let elem;

//     switch (event.key) {
//         case ".":
//             elem = document.querySelector("#key-decimal");
//             break;

//         case "c":
//             elem = document.querySelector("#key-ac");
//             break;

//         case "Enter":
//             elem = document.querySelector("#key-equal");
//             break;

//         case "=":
//         case "+":
//             elem = document.querySelector("#key-plus");
//             break;

//         case "-":
//         case "_":
//             elem = document.querySelector("#key-minus");
//             break;

//         case "/":
//             elem = document.querySelector("#key-divide");
//             break;

//         case "*":
//         case "x":
//             elem = document.querySelector("#key-multiply");
//             break;

//         case "%":
//             elem = document.querySelector("#key-percent");
//             break;

//         default:
//             elem = document.querySelector(`#key-${event.key}`);
//     }

//     if (elem) elem.click();
// });

// let buffer = "";
// let displayText;

// keysContainer.addEventListener("click", (event) => {
//     // displayText = findDisplayText(event.target.id);

//     // debugger;
//     displayText = findDisplayText(event.target.id);
//     liveCalc.innerHTML += displayText;

//     if (event.target.classList.contains("number-key")) {
//         buffer += displayText;
//     } else {
//         operands.push(event.target.id.split("-")[1]);

//         if (operands.length === 0) return;

//         if (operands.length === 1) {
//             firstNumber = parseFloat(buffer);
//             buffer = "";
//         } else {
//             secondNumber = parseFloat(buffer);
//             firstNumber = calculate(firstNumber, secondNumber, operands[0]);
//             secondNumber = null;
//             buffer = "";
//             operands.shift();
//         }
//     }
//     console.log("first number: " + firstNumber);
//     console.log("second number: " + secondNumber);
//     console.log(operands);
// });
