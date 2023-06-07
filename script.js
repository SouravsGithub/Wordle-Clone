// all the global variables are declared here
import { WORDS } from "./words.js";
const NUMBER_OF_GUESSES = 6;
let guessesRemaining = NUMBER_OF_GUESSES;
let currentGuess = [];
let nextLetter = 0;
let rightGuessString = WORDS[Math.floor(Math.random() * WORDS.length)];
console.log(rightGuessString);

// function to initialize the game board
function initBoard() {
  let board = document.querySelector("#game-board");

  for (let i = 0; i < NUMBER_OF_GUESSES; i++) {
    let row = document.createElement("section");
    row.className = "letter-row";

    for (let j = 0; j < 5; j++) {
      let box = document.createElement("div");
      box.className = "letter-box";
      row.appendChild(box);
    }
    board.appendChild(row);
  }
}

initBoard();

// function to listen to key presses and handle the event
document.addEventListener("keyup", (e) => {
  if (guessesRemaining === 0) {
    return;
  }

  let pressedKey = e.key;

  if (pressedKey === "Backspace" && nextLetter !== 0) {
    deleteLetter();
    return;
  }

  if (pressedKey === "Enter") {
    checkGuess();
    return;
  }

  let found = pressedKey.match(/[a-z]/gi);
  // checks for valid letters to insert
  if (!found || found.length > 1) {
    return;
  } else {
    insertLetter(pressedKey);
    return;
  }
});

// function to insert a letter when the key is pressed
function insertLetter(pressedKey) {
  if (nextLetter === 5) {
    return;
  }
  pressedKey = pressedKey.toLowerCase();
  let row =
    document.querySelectorAll(".letter-row")[
      NUMBER_OF_GUESSES - guessesRemaining
    ];
  let box = row.children[nextLetter];
  box.textContent = pressedKey;
  box.classList.add("filled-box");
  currentGuess.push(pressedKey);
  nextLetter += 1;
}

// function to delete a letter when Backspace is pressed
function deleteLetter() {
  if (nextLetter === 0) {
    return;
  }
  let row =
    document.querySelectorAll(".letter-row")[
      NUMBER_OF_GUESSES - guessesRemaining
    ];
  let box = row.children[nextLetter - 1];
  box.classList.remove("filled-box");
  box.textContent = "";
  currentGuess.pop();
  nextLetter -= 1;
}

function checkGuess() {
  let row =
    document.querySelectorAll(".letter-row")[
      NUMBER_OF_GUESSES - guessesRemaining
    ];
  let guessString = currentGuess.join("");
  let rightGuess = Array.from(rightGuessString);

  // checks if the word is of 5 letters or not
  if (nextLetter !== 5) {
    alert("Not enough letters in the word!");
    return;
  }
  // checks if the word exists in the wordlist or not
  if (!WORDS.includes(guessString)) {
    alert("Word is not in the list!");
    return;
  }

  // check wheather to change the color of the letters or not
  for (let i = 0; i < 5; i++) {
    let box = row.children[i];
    let letter = currentGuess[i];
    let letterColor = "";

    let letterPosition = rightGuess.indexOf(letter);

    if (letterPosition === -1) {
      letterColor = "grey";
    } else {
      if (currentGuess[i] === rightGuess[i]) {
        letterColor = "green";
      } else {
        letterColor = "yellow";
      }
    }
    console.log(letterColor);
    let delay = 250 * i;
    setTimeout(() => {
      box.style.backgroundColor = letterColor;
    }, delay);
  }

  // checks if you win or lose
  if (guessString === rightGuessString) {
    alert("You guessed it rught! Game over!");
    currentGuess = [];
    guessesRemaining = 0;
    nextLetter = 0;
    setTimeout(() => {
      location.reload();
    }, 1000);
    return;
  } else {
    guessesRemaining -= 1;
    currentGuess = [];
    nextLetter = 0;

    if (guessesRemaining === 0) {
      alert("You have run out of guesses! Game over!");
      alert(`The correct word was: ${rightGuessString}`);
    }
  }
}

document.querySelector(".keyboard-container").addEventListener("click", (e) => {
  const target = e.target;
  console.log(target);

  if (!target.classList.contains("keyboard-button")) {
    return;
  }
  let key = target.textContent;

  if (key === "Del") {
    key = "Backspace";
  }

  document.dispatchEvent(new KeyboardEvent("keyup", { key: key }));
});
