// Controls
const settings = document.querySelector(".settings-icon");
const controlsContainer = document.querySelector(".controls-container");
const icons = document.querySelectorAll(".options i");
const themeSelector = document.querySelector(".theme-selector");

settings.addEventListener("click", function (e) {
  e.stopPropagation();
  this.style.transform = "rotate(-45deg)";
  controlsContainer.classList.remove("hidden");
});

icons[0].addEventListener("click", function (e) {
  e.stopPropagation();
  this.classList.toggle("fa-volume-high");
  this.classList.toggle("fa-volume-xmark");
});

icons[1].addEventListener("click", function (e) {
  e.stopPropagation();
  themeSelector.classList.toggle("hidden");
});

icons.forEach((i) => {
  i.addEventListener("mousedown", function () {
    this.style.transform = "scale(1.2)";
  });
});

icons.forEach((i) => {
  i.addEventListener("mouseup", function () {
    this.style.transform = "scale(1)";
  });
});

document.addEventListener("click", function () {
  settings.style.transform = "rotate(0deg)";
  controlsContainer.classList.add("hidden");
  themeSelector.classList.add("hidden");
});

// Themes
let ocean = document.querySelector(".theme-ocean");
let forest = document.querySelector(".theme-forest");
let sunset = document.querySelector(".theme-sunset");
let purple = document.querySelector(".theme-purple");
let cyber = document.querySelector(".theme-cyber");

ocean.onclick = () => setTheme("ocean");
forest.onclick = () => setTheme("forest");
sunset.onclick = () => setTheme("sunset");
purple.onclick = () => setTheme("purple");
cyber.onclick = () => setTheme("cyber");

// Letters
const letters = "abcdefghijklmnopqrstuvwxyz";

// Get Array From Letters
let lettersArray = Array.from(letters);

// Select Letters Container
let lettersContainer = document.querySelector(".letters");

// Generate Letters
lettersArray.forEach((letter) => {
  // Create Span
  let span = document.createElement("span");

  // Create Letter Text Node
  let theLetter = document.createTextNode(letter);

  // Append Letter To Span
  span.appendChild(theLetter);

  // Add Class On Span
  span.className = "letter-box";

  // Append Span To Letters Container
  lettersContainer.appendChild(span);
});

// Object With Words And Categories

let randomPropName;
let theDraw;
let wrongAttempts;
let randomValue;
let guessSpans;

let getWordsObject = fetch("./words.json")
  .then((data) => data.json())
  .then((data) => {
    return data;
  });

getWordsObject.then((words) => {
  // Get Random Property

  // Get All Categories In an Array
  let allKeys = Object.keys(words);

  // Get Random Category
  let randomPropNumber = Math.floor(Math.random() * allKeys.length);
  // Get Random Category
  randomPropName = allKeys[randomPropNumber];
  // Get Random Property Values
  let randomPropValue = words[randomPropName];
  // Get Random Value Number
  let randomValueNumber = Math.floor(Math.random() * randomPropValue.length);
  // Get Random Value (The Chosen Word)
  randomValue = randomPropValue[randomValueNumber];

  // Set Category Info
  document.querySelector(".game-info .category span").innerHTML =
    randomPropName;

  // Select Letters Guess Element
  let letterGuessContainer = document.querySelector(".letters-guess");

  // Convert Choosen Word To Array
  let lettersAndSpace = Array.from(randomValue);

  // Create Spans Depending On Word
  lettersAndSpace.forEach((letter) => {
    // Create Empty Span
    let emptySpan = document.createElement("span");

    // If Letter Is Space
    if (letter === " ") {
      // Add Class To Span
      emptySpan.className = "has-space";
    }

    // Append Spans To The Letters Guess Container
    letterGuessContainer.appendChild(emptySpan);
  });

  // Select Guess Spans
  guessSpans = document.querySelectorAll(".letters-guess span");

  // Set Wrong Attempts
  wrongAttempts = 0;

  // Select The Draw Element
  theDraw = document.querySelector(".hangman-draw");
});

// Handle Clicking On Letters
document.addEventListener("click", (e) => {
  // Set The Choose Status
  let theStatus = false;

  if (e.target.className === "letter-box") {
    e.target.classList.add("clicked");

    // Get Clicked Letter
    let theClickedLetter = e.target.innerHTML.toLowerCase();

    // The Chosen Word
    let theChosenWord = Array.from(randomValue.toLowerCase());

    theChosenWord.forEach((wordLetter, wordIndex) => {
      // If The Clicked Letter Equals To One Of The Chosen Word Letter
      if (theClickedLetter === wordLetter) {
        // Set Status To Correct
        theStatus = true;

        // Loop On All Guess Spans
        guessSpans.forEach((span, spanIndex) => {
          if (wordIndex === spanIndex) {
            span.innerHTML = theClickedLetter;
          }
        });
      }
    });

    // Outside Loop

    // If Letter Is Worng
    if (theStatus !== true) {
      // Increase The Wrong Attempts
      wrongAttempts++;

      // Add Class Wrong On The Draw Element
      theDraw.classList.add(`wrong-${wrongAttempts}`);

      // Play Fail Sound
      let failSound = document.getElementById("fail");
      failSound.currentTime = 0;
      if (icons[0].classList.contains("fa-volume-high")) {
        failSound.play();
      }

      if (wrongAttempts === 8) {
        if (icons[0].classList.contains("fa-volume-high")) {
          document.getElementById("hanging").play();
        }

        setTimeout(() => {
          endGameWhenFail();
        }, 1000);

        lettersContainer.classList.add("finished");
      }
    } else {
      // Play Success Sound
      let successSound = document.getElementById("success");
      successSound.currentTime = 0;
      if (icons[0].classList.contains("fa-volume-high")) {
        successSound.play();
      }

      // If They Finished The Word
      let allGuessed = true;
      guessSpans.forEach((span, index) => {
        if (span.innerHTML === "" && !span.classList.contains("has-space")) {
          allGuessed = false;
        }
      });
      if (allGuessed) {
        let goodResult = document.getElementById("good-result");
        goodResult.currentTime = 0;
        if (icons[0].classList.contains("fa-volume-high")) {
          goodResult.play();
        }
        endGameWhenSuccess();
        lettersContainer.classList.add("finished");
      }
    }
  }
});

// End Game Function When Fail
function endGameWhenFail() {
  // Get The Singular Form Of The Category
  let singularCategory = "";
  switch (randomPropName) {
    case "programming":
      singularCategory = "Programming Language";
      break;
    case "people":
      singularCategory = "Person";
      break;
    case "countries":
      singularCategory = "Country";
      break;
    case "animals":
      singularCategory = "Animal";
      break;
    case "sports":
      singularCategory = "Sport";
      break;
    case "colors":
      singularCategory = "Color";
      break;
    case "fruits":
      singularCategory = "Fruit";
      break;
    case "vegetables":
      singularCategory = "Vegetable";
      break;
    case "jobs":
      singularCategory = "Job";
      break;
    case "languages":
      singularCategory = "Language";
      break;
    case "religions":
      singularCategory = "Religion";
      break;
    case "devices":
      singularCategory = "Device";
      break;
  }

  // Create Popup Div
  let div = document.createElement("div");

  let wordSpan = document.createElement("span");
  wordSpan.innerHTML = `${randomValue.toUpperCase()} <br>`;
  wordSpan.className = "chosen-word";

  // Create Reset Button
  let reset = document.createElement("button");
  reset.className = "reset-game";
  reset.innerHTML = "Play again?";

  reset.addEventListener("click", () => resetGame());

  // Create Text
  let divText = document.createElement("span");
  divText.innerHTML = `Game Over! You've Used All Your Tries.<br> The ${singularCategory} Is: `;

  // Append Text & Button To Div
  div.appendChild(divText);
  div.appendChild(wordSpan);
  div.appendChild(reset);

  // Add Class On Div
  div.className = "popup";

  // Edit Its Position
  div.style.left = "56%";

  // Append To The Body
  document.body.appendChild(div);
}

// End Game Function When Success
function endGameWhenSuccess() {
  // Get The Singular Form Of The Category
  let singularCategory = "";
  switch (randomPropName) {
    case "programming":
      singularCategory = "Programming Language";
      break;
    case "people":
      singularCategory = "Person";
      break;
    case "countries":
      singularCategory = "Country";
      break;
    case "animals":
      singularCategory = "Animal";
      break;
    case "sports":
      singularCategory = "Sport";
      break;
    case "colors":
      singularCategory = "Color";
      break;
    case "fruits":
      singularCategory = "Fruit";
      break;
    case "vegetables":
      singularCategory = "Vegetable";
      break;
    case "jobs":
      singularCategory = "Job";
      break;
    case "languages":
      singularCategory = "Language";
      break;
    case "religions":
      singularCategory = "Religion";
      break;
    case "devices":
      singularCategory = "Device";
      break;
  }

  // Create Popup Div
  let div = document.createElement("div");

  let wordSpan = document.createElement("span");
  wordSpan.textContent = randomValue.toUpperCase();
  wordSpan.className = "chosen-word";

  let triesSpan = document.createElement("span");
  triesSpan.textContent = wrongAttempts;
  triesSpan.className = "tries-number";

  // Create Reset Button
  let reset = document.createElement("button");
  reset.className = "reset-game";
  reset.innerHTML = "Play again?";

  reset.addEventListener("click", () => resetGame());

  // Create Texts
  let text1 = document.createTextNode(
    `🎉 Congratulations! You Win! The ${singularCategory} Is: `
  );

  // Create Text Before Tries
  let text2 = document.createTextNode(" | Tries Used: ");

  let text3 = document.createElement("span");
  text3.className = "level";
  if (wrongAttempts === 0) {
    text3.innerHTML = `<br>You're a Genius!<br>`;
  } else if (wrongAttempts <= 3) {
    text3.innerHTML = "<br>You're Great.<br>";
  } else if (wrongAttempts >= 3 && wrongAttempts <= 5) {
    text3.innerHTML = "<br>You're Doing Well.<br>";
  } else if (wrongAttempts > 5) {
    text3.innerHTML = "<br>You Can Do Better!<br>";
  }

  // Append Texts To Div
  div.append(text1, wordSpan, text2, triesSpan, text3, reset);

  // Add Class On Div
  div.className = "popup";

  // Append To The Body
  document.body.appendChild(div);
}

function setTheme(theme) {
  let root = document.documentElement;
  const themes = {
    ocean: {
      "--primary-color": "#1a237e",
      "--secondary-color": "#3949ab",
      "--accent-color": "#ff6b6b",
      "--success-color": "#4ecdc4",
      "--warning-color": "#ffe66d",
      "--bg-primary": "#0f172a",
      "--bg-secondary": "#1e293b",
      "--bg-light": "#334155",
    },
    forest: {
      "--primary-color": "#2e7d32",
      "--secondary-color": "#4caf50",
      "--accent-color": "#ff7043",
      "--success-color": "#66bb6a",
      "--warning-color": "#ffb74d",
      "--bg-primary": "#1b2e1f",
      "--bg-secondary": "#2e3d32",
      "--bg-light": "#3e4a42",
    },
    sunset: {
      "--primary-color": "#d84315",
      "--secondary-color": "#ff9800",
      "--accent-color": "#e91e63",
      "--success-color": "#ffb74d",
      "--warning-color": "#ffcc02",
      "--bg-primary": "#2e1a0f",
      "--bg-secondary": "#3d2e1b",
      "--bg-light": "#4a3626",
    },
    purple: {
      "--primary-color": "#6a1b9a",
      "--secondary-color": "#9c27b0",
      "--accent-color": "#f06292",
      "--success-color": "#ba68c8",
      "--warning-color": "#ffb74d",
      "--bg-primary": "#2a1a2e",
      "--bg-secondary": "#3d2b3d",
      "--bg-light": "#4a3b4a",
    },
    cyber: {
      "--primary-color": "#00bcd4",
      "--secondary-color": "#4fc3f7",
      "--accent-color": "#ff4081",
      "--success-color": "#1de9b6",
      "--warning-color": "#ffeb3b",
      "--bg-primary": "#0f1419",
      "--bg-secondary": "#1e2328",
      "--bg-light": "#2d3238",
    },
  };

  const selectedTheme = themes[theme];
  if (selectedTheme) {
    Object.entries(selectedTheme).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
  }
}

function resetGame() {
  const popup = document.querySelector(".popup");
  if (popup) popup.remove();

  // Reset Wrong Attempts
  wrongAttempts = 0;

  // Reset The Draw
  for (let i = 1; i <= 8; i++) {
    theDraw.classList.remove(`wrong-${i}`);
  }

  // Enable Letters Again
  lettersContainer.classList.remove("finished");
  document.querySelectorAll(".letter-box").forEach((el) => el.remove());

  // Claer Guess Word Inputs
  document.querySelector(".letters-guess").innerHTML = "";

  let getWordsObject = fetch("./words.json")
    .then((data) => data.json())
    .then((data) => {
      return data;
    });

  getWordsObject.then((words) => {
    // Reload Random Word From The Json File
    let allKeys = Object.keys(words);

    // Get Random Category
    let randomPropNumber = Math.floor(Math.random() * allKeys.length);
    // Get Random Category
    randomPropName = allKeys[randomPropNumber];
    // Get Random Property Values
    let randomPropValue = words[randomPropName];
    // Get Random Value Number
    let randomValueNumber = Math.floor(Math.random() * randomPropValue.length);
    // Get Random Value (The Chosen Word)
    randomValue = randomPropValue[randomValueNumber];

    // Set Category Info
    document.querySelector(".game-info .category span").innerHTML =
      randomPropName;

    // Select Letters Guess Element
    let letterGuessContainer = document.querySelector(".letters-guess");

    // Convert Choosen Word To Array
    let lettersAndSpace = Array.from(randomValue);

    // Create Spans Depending On Word
    lettersAndSpace.forEach((letter) => {
      // Create Empty Span
      let emptySpan = document.createElement("span");

      // If Letter Is Space
      if (letter === " ") {
        // Add Class To Span
        emptySpan.className = "has-space";
      }

      // Append Spans To The Letters Guess Container
      letterGuessContainer.appendChild(emptySpan);
    });

    // Select guessSpans again
    guessSpans = document.querySelectorAll(".letters-guess span");

    // Generate Letters
    lettersArray.forEach((letter) => {
      // Create Span
      let span = document.createElement("span");

      // Create Letter Text Node
      let theLetter = document.createTextNode(letter);

      // Append Letter To Span
      span.appendChild(theLetter);

      // Add Class On Span
      span.className = "letter-box";

      // Append Span To Letters Container
      lettersContainer.appendChild(span);
    });
  });
}
