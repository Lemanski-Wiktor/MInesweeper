"use strict";

const elWidthInput = document.getElementById("width--input");
const elHeightInput = document.getElementById("height--input");
const elMinesInput = document.getElementById("mines--input");
const elMinesweeperArea = document.getElementById("minesweeper--area");
const elNickname = document.getElementById("nickname--input");

let widthInput = Number(document.getElementById("width--input").value);
let heightInput = Number(document.getElementById("height--input").value);
let minesInput = Number(document.getElementById("mines--input").value);
let nickname = document.getElementById("nickname--input").value;

const btnUpdate = document.getElementById("btn--update");
const elBombsLeft = document.getElementById("bombs_left_p");
const timer = document.querySelector(".time-counter");
const resultP = document.getElementById("result_p");
const scoreboard = document.getElementById("scores-list");

let bombsArr = [];
let exposed = [];
let isPlaying = false;
let bombsLeft = minesInput;
var isTicking = false;
var time = 0;
var interval = null;
let blocksNumber = widthInput * heightInput;
let timeOfStart = new Date();
let isFirst = true;
let timeOfGame = 0;
let mode = `${widthInput}x${heightInput}x${minesInput}`;

const startTimer = () => {
  if (isTicking) return;
  isTicking = true;
  let min = 0;

  interval = setInterval(() => {
    time++;

    if (time > 59) {
      time -= 60;
      timer.textContent = `${++min}:0${time}`;
    } else {
      if (time < 10) {
        timer.textContent = `${min}:0${time}`;
      } else if (time >= 10) {
        timer.textContent = `${min}:${time}`;
      }
    }
  }, 1000);
};
const stopTimer = () => {
  if (interval !== null) clearInterval(interval);
  isTicking = false;
};

const gameOver = function (block) {
  let temp = new Date().getTime();
  timeOfGame = temp - timeOfStart;
  stopTimer();
  alert("Przegrałeś");
  resultP.textContent = "GAME OVER!";
  resultP.style.color = "red";
  block.style.backgroundColor = "tomato";
  isPlaying = false;
  let elChild;
  let counter = 1;
  for (let i = 0; i < widthInput; i++) {
    for (let j = 0; j < heightInput; j++) {
      elChild = document.getElementById(`${counter++}`);
      if (bombsArr.includes(Number(elChild.id))) {
        elChild.classList.remove("flags");
        elChild.classList.add("bombs");
      }
    }
  }
};
const gameWin = function () {
  let temp = new Date().getTime();
  timeOfGame = temp - timeOfStart;
  stopTimer();
  setCookie(nickname, timeOfGame);
  showBestScores();
  resultP.textContent = "YOU WIN!";
  resultP.style.color = "#007200";
  isPlaying = false;
};

const setClickNResult = function (block) {
  let blockId = Number(block.id);
  function checkNeighbor(id) {
    let currentblock = document.querySelector(
      `#minesweeper--area .boxes:nth-child(${id})`
    );
    if (!exposed.includes(id) && !currentblock.classList.contains("flags")) {
      exposed.push(id);
    }
    
    currentblock.setAttribute("style", `background-color: lightgray`);
    // if (!currentblock.classList.contains("flags")) {
      let counter = 0;
      if (
        bombsArr.includes(id - widthInput - 1) == true &&
        id > widthInput &&
        (id - 1) % widthInput != 0
      )
        counter++;
      if (bombsArr.includes(id - widthInput) == true && id > widthInput)
        counter++;
      if (
        bombsArr.includes(id - widthInput + 1) == true &&
        id > widthInput &&
        id % widthInput != 0
      )
        counter++;
      if (
        bombsArr.includes(id - 1) == true &&
        Math.floor(id / widthInput) * widthInput + 1 != id
      )
        counter++;
      if (bombsArr.includes(id + 1) == true && id % widthInput != 0) counter++;
      if (
        bombsArr.includes(id + Number(widthInput) - 1) == true &&
        id < (Number(heightInput) - 1) * Number(widthInput) + 1 &&
        (id - 1) % Number(widthInput) != 0
      )
        counter++;
      if (bombsArr.includes(id + Number(widthInput)) == true) counter++;
      if (
        bombsArr.includes(id + Number(widthInput) + 1) == true &&
        id < (Number(heightInput) - 1) * Number(widthInput) + 1 &&
        id % Number(widthInput) != 0
      )
        counter++;

      if (counter != 0) {
        currentblock.textContent = `${counter}`;
      }
      return counter;
    // }
  }
  function floodFill(id) {
    let currentblock = document.querySelector(
      `#minesweeper--area .boxes:nth-child(${id})`
    );
    if (
      !exposed.slice(0, exposed.length - 1).includes(id) &&
      checkNeighbor(id) == 0 &&
      !currentblock.classList.contains("flags")
    ) {
      if (id > Number(widthInput) && (id - 1) % Number(widthInput) != 0) {
        if (checkNeighbor(id - Number(widthInput) - 1) == 0)
          floodFill(id - Number(widthInput) - 1);
      }
      if (id > Number(widthInput)) {
        if (checkNeighbor(id - Number(widthInput)) == 0)
          floodFill(id - Number(widthInput));
      }
      if (id > Number(widthInput) && id % Number(Number(widthInput)) != 0) {
        if (checkNeighbor(id - Number(widthInput) + 1) == 0)
          floodFill(id - Number(widthInput) + 1);
      }
      if (Math.floor(id / Number(widthInput)) * Number(widthInput) + 1 != id) {
        if (checkNeighbor(id - 1) == 0) floodFill(id - 1);
      }
      if (id % Number(widthInput) != 0) {
        if (checkNeighbor(id + 1) == 0) floodFill(id + 1);
      }
      if (
        id < (Number(heightInput) - 1) * Number(widthInput) + 1 &&
        (id - 1) % Number(widthInput) != 0
      ) {
        if (checkNeighbor(id + Number(widthInput) - 1) == 0)
          floodFill(id + Number(widthInput) - 1);
      }
      if (id < Number(widthInput) * (Number(heightInput) - 1)) {
        if (checkNeighbor(id + Number(widthInput)) == 0)
          floodFill(id + Number(widthInput));
      }
      if (
        id < (Number(heightInput) - 1) * Number(widthInput) + 1 &&
        id % Number(widthInput) != 0
      ) {
        if (checkNeighbor(id + Number(widthInput) + 1) == 0)
          floodFill(id + Number(widthInput) + 1);
      }
    }
  }
  function leftClick() {
    if (isPlaying) {
      if (isFirst == true) {
        isFirst = false;
        timeOfStart = new Date().getTime();
        startTimer();
      }

      if (bombsArr.includes(blockId) == false) {
        if (exposed.includes(blockId) == false) {
          let n = checkNeighbor(blockId);

          if (n == 0) {
            floodFill(blockId);
          }
        }
        if (exposed.length == blocksNumber - bombsArr.length) {
          gameWin();
        }
      } else {
        gameOver(block);
      }
      block.removeEventListener("click", leftClick);
      block.removeEventListener("contextmenu", rightClick);
    }
  }

  function rightClick() {
    window.event.returnValue = false;
    if (isFirst == false) {
      if (isPlaying && exposed.includes(blockId) == false) {
        if (isFirst == true) {
          isFirst = false;
          timeOfStart = new Date().getTime();
        }

        if (block.classList.contains("flags")) {
          block.style.backgroundColor = "#6a994e";
          block.classList.remove("flags");
          block.addEventListener("click", leftClick);
          block.addEventListener("contextmenu", rightClick);
          bombsLeft++;
        } else if (bombsLeft >= 1) {
          block.classList.add("flags");
          block.addEventListener("contextmenu", rightClick);
          block.removeEventListener("click", leftClick);
          bombsLeft--;
        }

        block.addEventListener("contextmenu", rightClick);
        window.event.returnValue = false;
      }
      elBombsLeft.textContent = `Pozostało bomb: ${bombsLeft}`;
    }
  }

  block.addEventListener("click", leftClick);
  if (bombsLeft >= 1) block.addEventListener("contextmenu", rightClick);
};

const init = function () {
  bombsArr = [];
  exposed = [];
  widthInput = 0;
  heightInput = 0;
  elMinesweeperArea.innerHTML = "";
  minesInput = Number(document.getElementById("mines--input").value);
  isFirst = true;

  if (minesInput > 100) {
    bombsLeft = 100;
  } else if (minesInput < 5) {
    bombsLeft = 5;
  } else {
    bombsLeft = minesInput;
  }

  elBombsLeft.textContent = `Pozostało bomb: ${bombsLeft}`;
  time = 0;
  stopTimer();
  timer.textContent = "0:00";
  resultP.textContent = "";
  nickname = document.getElementById("nickname--input").value;
};
const correctInputs = function () {
  if (elWidthInput.value > 100) {
    widthInput = 100;
    elWidthInput.textContent = "100";
    elWidthInput.value = 100;
  } else if (elWidthInput.value < 5) {
    widthInput = 5;
    elWidthInput.textContent = "5";
    elWidthInput.value = 5;
  } else {
    widthInput = elWidthInput.value;
  }
  if (elHeightInput.value > 100) {
    heightInput = 100;
    elHeightInput.textContent = "100";
    elHeightInput.value = 100;
  } else if (elHeightInput.value < 5) {
    heightInput = 5;
    elHeightInput.textContent = "5";
    elHeightInput.value = 5;
  } else {
    heightInput = elHeightInput.value;
  }
  if (elMinesInput.value > 100) {
    minesInput = 100;
    elMinesInput.textContent = "100";
    elMinesInput.value = 100;
  } else if (elMinesInput.value < 5) {
    minesInput = 5;
    elMinesInput.textContent = "5";
    elMinesInput.value = 5;
  } else {
    minesInput = elMinesInput.value;
  }
  blocksNumber = widthInput * heightInput;
  mode = `${widthInput}x${heightInput}x${minesInput}`;
};
const drawMines = function (bombs) {
  while (bombsArr.length != bombs) {
    const randomNumber =
      Math.trunc(Math.random() * (widthInput * heightInput)) + 1;
    if (!bombsArr.includes(randomNumber)) {
      bombsArr.push(randomNumber);
    }
  }
};
const generateMatrix = function (m, n) {
  elMinesweeperArea.setAttribute(
    "style",
    `height: ${heightInput * 30}px; width: ${widthInput * 30}px`
  );
  drawMines(minesInput);
  let counter = 1;
  isPlaying = true;

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      let el = document.createElement("div");
      el.classList.add("boxes");
      el.id = counter++;
      setClickNResult(el);
      elMinesweeperArea.appendChild(el);
    }
  }
  elBombsLeft.textContent = `Pozostało bomb: ${bombsLeft}`;
};

const getBestScores = () => {
  var bestScores = getCookies();
  if (bestScores === null) return null;
  if (bestScores.length === 1) return bestScores;

  const toRemove = document.querySelectorAll("ol > li");
  toRemove.forEach((e) => e.remove());

  bestScores.sort((a, b) => {
    const aTime = parseInt(a.substring(a.indexOf(",") + 1));
    const bTime = parseInt(b.substring(b.indexOf(",") + 1));

    if (aTime > bTime) {
      return 1;
    } else {
      return -1;
    }
  });

  bestScores = bestScores.slice(0, 10);
  return bestScores;
};

const showBestScores = () => {
  const scoresArray = getBestScores();

  if (scoresArray == null) return;
  scoreboard.innerHTML = "";
  scoresArray.forEach((el) => {
    if (el.substring(0, el.indexOf("-")) == mode) {
      var name = el.substring(el.indexOf("=") + 1, el.indexOf(","));

      var time = el.substring(el.indexOf(",") + 1, el.length);
      time =
        time.substring(0, 1) +
        ":" +
        time.substring(1, 3) +
        "." +
        time.substring(3);

      if (time.substring(2, 3) == 6) {
        time = time.substring(0, 2) + time.substring(3);
      }

      const li = document.createElement("li");
      li.textContent = `${name} - ${time}`;

      scoreboard.append(li);
    }
  });
};

//COOKIE
const removeCookie = function () {
  var cookies = document.cookie.split(";");

  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i];
    var eqPos = cookie.indexOf("=");
    var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
};

const setCookie = (name, cTime) => {
  const date = new Date();
  date.setTime(date.getTime + 24 * 1000000);
  if (name == "") name = `nickname${Math.trunc(Math.random() * 100)}`;

  let seconds = Math.floor(cTime / 1000);
  let minutes = Math.floor(seconds / 60);
  if (seconds >= 60) {
    seconds -= 60 * minutes;
  }
  if (seconds < 10) {
    seconds = `0${seconds}`;
  }

  let strTime = `${minutes}${seconds}${String(cTime).substring(
    String(cTime).length - 3
  )}`;

  const cData = [name, strTime];

  document.cookie = `${mode}-${Math.trunc(
    Math.random() * 100
  )}=${cData}; path=/`;
};

const getCookies = () => {
  const cDecoded = decodeURIComponent(document.cookie);
  const cArray = cDecoded.split("; ");

  if (cArray[0] == "") return null;

  return cArray;
};

// removeCookie();
showBestScores();
generateMatrix(widthInput, heightInput);

btnUpdate.addEventListener("click", function () {
  init();
  correctInputs();
  showBestScores();
  generateMatrix(widthInput, heightInput);
  console.log(bombsArr);
});
