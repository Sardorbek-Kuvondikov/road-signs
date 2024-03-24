const elPlayRender = document.querySelector(".js-paly-render");
const elPlayTemplate = document.querySelector(".js-play-template").content;
const elStartBtn = document.querySelector(".js-start-btn");
const elPlayModal = document.querySelector(".js-play-modal");
const elForm = document.querySelector(".js-play-form");
const elSelect = elForm.querySelector(".js-play-select");
const elUpdateImg = document.querySelector(".js-update-img");
const elGameOver = document.querySelector(".js-game-over");
const elQuestionsRender = document.querySelector(".js-questions-text");
const elQuestionText = document.querySelector(".js-question");
const elGameScore = document.querySelector(".js-game-score");
const elWinnerUpdate = document.querySelector(".js-winner-img");
const elGameErrorScore = document.querySelector(".js-error-score");
const elWinner = document.querySelector(".js-winner");

// random arr
const randomArr = [];

let result = [];

let score = 0;

let idx = 0;

const maxErrors = 5;

let errorCount = 0;

let clicked = false;

elGameScore.textContent = `скоре: ${score}`;
function renderRoads(array, node) {
  // * quetion
  elQuestionText.textContent = array[randomArr[idx]].symbol_title;
  // elQuestionText.dataset.questionId = array[randomArr[idx]].id;

  node.innerHTML = "";
  const roadDocFrg = document.createDocumentFragment();
  for (const arr of array) {
    const roadClone = elPlayTemplate.cloneNode(true);
    roadClone.querySelector(".js-play-img").src = arr.symbol_img;
    roadClone.querySelector(".js-play-img").alt = arr.symbol_title;
    roadClone.querySelector(".js-play-img").dataset.dataId = arr.id;
    roadClone.querySelector(".js-road-item").dataset.itemId = arr.id;

    roadDocFrg.appendChild(roadClone);
  }
  node.appendChild(roadDocFrg);
}
//
const ranDomRoad = (arr) => {
  let number;
  for (let i = 0; i < arr; i++) {
    number = Math.floor(Math.random() * arr);
  }
  return number;
};
//
function createRandomArr(arr) {
  let randomNumber = ranDomRoad(arr);
  if (randomArr.length < arr) {
    if (!randomArr.some((number) => number == randomNumber)) {
      randomArr.push(randomNumber);
    }
    createRandomArr(arr);
  }
  return randomArr;
}
// random
const toCheckArr = (choose) => {
  let res;
  if (elSelect.value.length) {
    if (choose == "easy") {
      res = createRandomArr(14);
    } else if (choose == "normal") {
      res = createRandomArr(21);
    } else if (choose == "difficult") {
      res = createRandomArr(28);
    }
  }
  for (let i = 0; i < res.length; i++) {
    for (let si = 0; si < roadSymbol.length; si++) {
      if (roadSymbol[si].id == res[i]) {
        result = [...result, roadSymbol[si]];
      }
    }
  }
  renderRoads(result, elPlayRender);
};

// form
elForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  selectValue = elSelect.value;
  elPlayModal.classList.remove("hidden");
  elForm.classList.add("hidden");
  toCheckArr(selectValue);
});

// To'g'ri javob
function roadTrueResponse(questionResult, item) {
  questionResult.classList.remove("hidden");
  questionResult.querySelector("img").src = "./images/checkmark.gif";
  let roadAudio = questionResult.querySelector("#road-audio");
  roadAudio.play();
  // questionResult.classList.add("pointer-events-none");
  setTimeout(() => {
    item.style.pointerEvents = "none";
    item.style.opacity = 0;
  }, 1700);
}

// noto'g'ri javob
function roatErrorResponse(questionResult, item) {
  questionResult.classList.remove("hidden");
  questionResult.querySelector("img").src = "./images/error.png";
  let roadErrorAudio = questionResult.querySelector("#road-error-audio");
  roadErrorAudio.play();
  setTimeout(() => {
    questionResult.classList.add("hidden");
  }, 1100);
}

elPlayRender.addEventListener("click", (evt) => {
  if (clicked) return;
  const id = Number(evt.target.dataset.dataId);
  let defRoad = roadSymbol.find((road) => road.id == id);
  let resRoad = result.find(
    (road) => road.symbol_title == elQuestionText.textContent
  );
  if (id || id == 0) {
    if (defRoad.id == resRoad.id) {
      score += 1;
      if (idx + 1 === result.length) {
        idx = 0;
        result = [];
        setTimeout(() => {
          elWinner.classList.remove("hidden");
          elPlayModal.classList.add("hidden");
        }, 800);
      } else {
        idx++;
        elQuestionText.textContent = result[randomArr[idx]].symbol_title;
      }
      checkAnswer(id, true);
    } else {
      checkAnswer(id, false);
      score -= 2;
      errorCount++;
      if (errorCount >= maxErrors) {
        // game over
        setTimeout(() => {
          elPlayModal.classList.add("hidden");
          elGameOver.classList.remove("hidden");
          elGameErrorScore.textContent = `скоре: ${score}`;
        }, 500);
      }
    }
    elGameScore.textContent = `скоре: ${score}`;
  }

  // location reload() game over
  function gameUpdate(evt) {
    evt.preventDefault();
    location.reload();
  }
  elUpdateImg.addEventListener("click", gameUpdate);

  // you winner  v
  function gameWinnerFn() {
    evt.preventDefault();
    location.reload();
  }
  elWinnerUpdate.addEventListener("click", gameWinnerFn);

  // chekmark
  function checkAnswer(id, type) {
    const elItems = elPlayRender.querySelectorAll(".js-road-item");

    elItems.forEach((item) => {
      const itemId = Number(item.dataset.itemId);
      if (id === itemId) {
        const questionResult = item.querySelector(".js-question-result");
        if (type) {
          roadTrueResponse(questionResult, item);
        } else {
          roatErrorResponse(questionResult, item);
        }
      }
    });
  }
  clicked = true;
  setTimeout(() => {
    clicked = false;
  }, 1700);
});
