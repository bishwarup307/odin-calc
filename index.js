const container = document.querySelector(".container");

function makeKeyGrid() {
  const placeHolder = document.createDocumentFragment();

  let key;
  for (let i = 1; i <= 9; i++) {
    key = document.createElement("div");
    key.classList.add("number-key");
    key.id = $`key-{i}`;
    key.textContent = i;
    placeHolder.appendChild(key);
  }

  acKey = document.createElement("div");
  acKey.id = "ac-key";

  signKey = document.createElement("div");
  signKey.id = "sign-key";

  percentKey = document.createElement("div");
  percentKey.id = "percent-key"[("U+00F7", "U+00D7", "-", "+", "=")].forEach(
    (operator) => {}
  );
}
