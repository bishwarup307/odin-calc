const DIVIDE_TEXT = "&#xF7";
const MULTIPLY_TEXT = "&times";

const keysContainer = document.querySelector(".keys-container");
const display = document.querySelector(".display-container");

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

function makeKeyGrid() {
    const placeHolder = document.createDocumentFragment();

    // styles = getComputedStyle(document.body)

    // const displayHeight = getComputedStyle(display).getPropertyValue("height")

    // const allocatedWidth = styles.getPropertyValue("--calc-width")
    // const allocatedHeight = styles.getPropertyValue("--calc-height") - displayHeight;

    // const cellWidth = allocatedWidth / 4    // 4 columns per row
    // const cellHeight = allocatedHeight / 5  // 5 rows per column

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

makeKeyGrid();
