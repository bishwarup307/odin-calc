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

// Builds the keys on the calculator
function makeKeyGrid() {
    const placeHolder = document.createDocumentFragment();

    SYMBOLS.forEach((symbol) => {
        key = document.createElement("div");
        key.innerHTML = symbol.text;
        key.classList.add("key");
        if (!symbol.id) {
            key.classList.add("number-key");
            symbol.id = `${symbol.text}`;
        }

        if (symbol.id === "decimal") key.classList.add("number-key");

        if (OPERATORS.includes(symbol.id)) key.classList.add("operator-key");
        if (OTHERS.includes(symbol.id)) key.classList.add("other-key");

        key.id = `key-${symbol.id}`;
        if (symbol.text === 0) key.classList.add("zero-key");
        placeHolder.appendChild(key);
    });

    keysContainer.appendChild(placeHolder);
}

function keyDownEffect(event) {
    event.target.style.opacity = 0.6;
}

function keyUpEffect(event) {
    setTimeout(() => (event.target.style.opacity = 1), 90);
}

makeKeyGrid();

// We are assigning keyboard keys to the buttons to make
// user able to type their expression in addition to
// clicking the key buttons
keysContainer.addEventListener("click", keyDownEffect);
keysContainer.addEventListener("click", keyUpEffect);

window.addEventListener("keyup", (event) => {
    let elem;

    switch (event.key) {
        case ".":
            elem = document.querySelector("#key-decimal");
            break;

        case "c":
            elem = document.querySelector("#key-ac");
            break;

        case "Enter":
            elem = document.querySelector("#key-equal");
            break;

        case "=":
        case "+":
            elem = document.querySelector("#key-plus");
            break;

        case "-":
        case "_":
            elem = document.querySelector("#key-minus");
            break;

        case "/":
            elem = document.querySelector("#key-divide");
            break;

        case "*":
        case "x":
            elem = document.querySelector("#key-multiply");
            break;

        case "%":
            elem = document.querySelector("#key-percent");
            break;

        default:
            elem = document.querySelector(`#key-${event.key}`);
    }

    if (elem) elem.click();
});

let buffer = "";
let displayText;

keysContainer.addEventListener("click", (event) => {
    // displayText = findDisplayText(event.target.id);

    // debugger;
    displayText = findDisplayText(event.target.id);
    liveCalc.innerHTML += displayText;

    if (event.target.classList.contains("number-key")) {
        buffer += displayText;
    } else {
        operands.push(event.target.id.split("-")[1]);

        if (operands.length === 0) return;

        if (operands.length === 1) {
            firstNumber = parseFloat(buffer);
            buffer = "";
        } else {
            secondNumber = parseFloat(buffer);
            firstNumber = calculate(firstNumber, secondNumber, operands[0]);
            secondNumber = null;
            buffer = "";
            operands.shift();
        }
    }
    console.log("first number: " + firstNumber);
    console.log("second number: " + secondNumber);
    console.log(operands);
});
