const words = ["flower", "river", "moon", "sun", "hehe", "babe", "haha", "hoho", "hihi", "huhu"];
const char_random_container = document.querySelector(".char-random__container");
const player_selected_container = document.querySelector(".player-selected");
const triesElement = document.querySelectorAll(".tries");
const triesText = document.querySelector("#tries-count");
const mistakesText = document.querySelector(".mistakes-char-container");
const resetBtn = document.querySelector(".action .btn--secondary");
const randomBtn = document.querySelector(".action .btn--primary");

let inputCharsWrapper = document.querySelectorAll(".player-selected__wrapper");
let word = words[0];
let shuffledChars =word.split("").sort(() => Math.random() - 0.5);
let tries = 0;
let currentWaiting = 0;

function resetWord() {
    currentWaiting = 0;
    word = words[Math.floor(Math.random() * words.length)];
    shuffledChars = word.split("").sort(() => Math.random() - 0.5);
}

function resetCharContainer() {
    char_random_container.innerHTML = "";
    shuffledChars.forEach((char) => {
        const charDiv = document.createElement("div");
        charDiv.textContent = char;
        char_random_container.appendChild(charDiv);
    });
}

function resetPlayerSelection() {
    player_selected_container.innerHTML = "";
    for(let i = 1; i <= word.length; i++) {
        const wrapper = document.createElement("div");
        wrapper.classList.add("player-selected__wrapper");
        const input = document.createElement("p");
        input.classList.add("player-selected__char");
        wrapper.appendChild(input);
        if (i === 1) {
            wrapper.classList.add("waiting");
            input.textContent = "_";
        }
        player_selected_container.appendChild(wrapper);
    }
    inputCharsWrapper = document.querySelectorAll(".player-selected__wrapper");
}

function resetTrying() {
    tries = 0;
    triesText.textContent = tries;
    triesElement.forEach((el) => {
        if (el.classList.contains("active")) {
            el.classList.remove("active");
        }
    })
}

function resetMistakes() {
    mistakesText.textContent = "";
}

function updateWaiting() {
    if (currentWaiting >= word.length) return;
    let wrapperElement = inputCharsWrapper[currentWaiting];
    if (!wrapperElement.classList.contains("waiting")) {
        wrapperElement.classList.add("waiting");
    }
    let charInputEl = wrapperElement.querySelector(".player-selected__char");
    charInputEl.textContent = "_";
}

function setChar(index, text) {
    if (index >= word.length) return;
    let wrapperElement = inputCharsWrapper[index];
    if (wrapperElement.classList.contains("waiting")) {
        wrapperElement.classList.remove("waiting");
    }
    let charInputEl = wrapperElement.querySelector(".player-selected__char");
    charInputEl.textContent = text;

    currentWaiting++;
    if (currentWaiting === word.length) {
        setTimeout(checkResult, 100);
    } else {
        updateWaiting();
    }
}

function checkResult() {
    let playerWord = "";
    inputCharsWrapper.forEach((el) => {
        playerWord += el.querySelector(".player-selected__char").textContent;
    });

    if (playerWord === word) {
        alert("You win!");
        resetBtn.click();
    } else {
        currentWaiting = 0;
        updateMistake(playerWord);
        updateTries();
        resetPlayerSelection();
    }
}

function updateMistake(playerWord) {
    let mistakes = [];
    for (let i = 0; i < word.length; i++) {
        if (word[i] !== playerWord[i]) {
            mistakes.push(playerWord[i]);
        }
    }
    mistakesText.textContent = mistakes.join(", ");
}

function removeChar(index) {
    if (index < 0) return;
    if (index < inputCharsWrapper.length) {
        let wrapperElement = inputCharsWrapper[index];
        if (wrapperElement.classList.contains("waiting")) {
            wrapperElement.classList.remove("waiting");
        }
        let charInputEl = wrapperElement.querySelector(".player-selected__char");
        charInputEl.textContent = "";
    }
    currentWaiting--;
    updateWaiting();
}

resetBtn.addEventListener("click", () => {
    resetWord();
    resetCharContainer();
    resetPlayerSelection();
    resetTrying();
    resetMistakes();
});

randomBtn.addEventListener("click", () => {
    resetWord();
    resetCharContainer();
    resetPlayerSelection();
    resetMistakes();
});

function updateTries() {
    tries++;
    triesText.textContent = tries;
    triesElement[tries - 1].classList.add("active");
    if (tries >= 5) {
        alert("You lose!");
        resetBtn.click();
        return;
    }
}

document.addEventListener("keydown", (e) => {
    if (/^[a-zA-Z]$/.test(e.key)) {
        if (currentWaiting < word.length) {
            setChar(currentWaiting, e.key);
        }
    } else if (e.key === "Backspace" && currentWaiting > 0) {
        removeChar(currentWaiting);
    }
});