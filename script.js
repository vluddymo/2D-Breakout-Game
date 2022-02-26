import { blocks } from "./modules/levels/level_1.mjs";
import {emptyContainer, addBlock} from "./modules/utils/utils.mjs";
import { BLOCK_WIDTH } from "./modules/constants/constants.mjs";

const grid = document.querySelector(".grid");
const scoreDisplay = document.querySelector(".score");

const BOARD_WIDTH = 560;
const BOARD_HEIGHT = 300;

const BALL_DIAMETER = 22;
const BALL_START = [270, 32];
const BALL_PACE = 2;

const USER_START = 230;
const USER_Y_TRESHOLD = 30;
const USER_PACE = 10;

const BLOCK_REWARD = 100;

let score = 0;
let multiplier = 1;

let timerId;

let xDirection = BALL_PACE;
let yDirection = BALL_PACE;

// up + right = 6 || up +left = 2 || down +right = -2 || down + left = -6
let directionCode;

function calculateDirectionCode() {
  directionCode = xDirection + 2 * yDirection;
}

let currentPosition = USER_START;
let currentBallPosition = BALL_START;

addBlock(grid, blocks);

// Add user
const user = document.createElement("div");
user.classList.add("user");
drawUser();
grid.appendChild(user);


// Draw user
function drawUser() {
  user.style.left = currentPosition + "px";
}

// Move user
function moveUser(e) {
  switch (e.key) {
    case "ArrowLeft":
      if (currentPosition > 0) {
        currentPosition -= USER_PACE;
        drawUser();
      }
      break;
    case "ArrowRight":
      if (currentPosition < BOARD_WIDTH - BLOCK_WIDTH) {
        currentPosition += USER_PACE;
        drawUser();
      }
      break;
  }
}

document.addEventListener("keydown", (e) => moveUser(e));

// Add ball
const ball = document.createElement("div");
ball.classList.add("ball");
drawBall();
grid.appendChild(ball);

// Draw ball
function drawBall() {
  ball.style.left = currentBallPosition[0] + "px";
  ball.style.bottom = currentBallPosition[1] + "px";
}

// Move ball
function moveBall() {
  currentBallPosition[0] += xDirection;
  currentBallPosition[1] += yDirection;
  drawUser();
  calculateDirectionCode();
  drawBall();
  checkForCollisions();
  checkForGameEnd();
}

timerId = setInterval(moveBall, 20);

function checkForCollisions() {
  checkForBlockCollisions();
  checkForWallCollisions();
  checkForUserCollision();
}

function returnCollisionCase() {
  for (let i = 0; i < blocks.length; i++) {
    if (
      (currentBallPosition[0] + BALL_DIAMETER == blocks[i].bottomLeft[0] ||
        currentBallPosition[0] == blocks[i].bottomRight[0]) &&
      currentBallPosition[1] + BALL_DIAMETER > blocks[i].bottomLeft[1] &&
      currentBallPosition[1] < blocks[i].topLeft[1]
    ) {
      return { case: "right_left", block: i };
    } else if (
      currentBallPosition[0] + BALL_DIAMETER >= blocks[i].bottomLeft[0] &&
      currentBallPosition[0] <= blocks[i].bottomRight[0] &&
      (currentBallPosition[1] + BALL_DIAMETER == blocks[i].bottomLeft[1] ||
        currentBallPosition[1] == blocks[i].topLeft[1])
    ) {
      return { case: "top_bottom", block: i };
    }
  }
}

function handleCollisionAction(i) {
  const allBlocks = Array.from(document.querySelectorAll(".block"));
  allBlocks[i].classList.remove("block");
  blocks.splice(i, 1);
  score = score + multiplier * BLOCK_REWARD;
  multiplier += multiplier;
  scoreDisplay.innerHTML = score;
}

function checkForBlockCollisions() {
  if (currentBallPosition[1] + BALL_DIAMETER < 210) return;
  if (returnCollisionCase() == undefined) return;

  switch (returnCollisionCase().case) {
    case "top_bottom":
      yDirection = -yDirection;
      handleCollisionAction(returnCollisionCase().block);
      break;
    case "right_left":
      xDirection = -xDirection;
      handleCollisionAction(returnCollisionCase().block);
      break;
    default:
      break;
  }
}

function checkForWallCollisions() {
  if (
    !(currentBallPosition[0] < 0) && // Guard-clause : If no crash with left, right or top wall => exit function
    !(currentBallPosition[0] >= BOARD_WIDTH - BALL_DIAMETER) &&
    !(currentBallPosition[1] >= BOARD_HEIGHT - BALL_DIAMETER)
  )
    return;
  if (!(currentBallPosition[1] >= BOARD_HEIGHT - BALL_DIAMETER))
    return (xDirection = -xDirection);
  yDirection = -yDirection;
}

function userCollisionGuardClause() {
  const isOnUserBlock =
    currentBallPosition[0] + BALL_DIAMETER >= currentPosition &&
    currentBallPosition[0] <= currentPosition + BLOCK_WIDTH;

  return (
    directionCode > 0 ||
    currentBallPosition[1] > USER_Y_TRESHOLD ||
    !isOnUserBlock
  );
}

function bounceOffUser() {
  // Deflection handling
  if (currentBallPosition[1] === USER_Y_TRESHOLD) {
    multiplier = 1;
    return (yDirection = -yDirection);
  }
  xDirection = -xDirection;
}

function checkForUserCollision() {
  if (userCollisionGuardClause()) return;
  bounceOffUser();
}

function checkForGameEnd() {
  if (currentBallPosition[1] > 0 && blocks.length != 0) return;
  if (currentBallPosition[1] <= 0) return presentScore("😕 Game Over! 😒");
  return presentScore("🤩 Congratulations! 🤩");
}

function presentScore(outcome) {
  clearInterval(timerId);
  const finishDisplay = document.createElement("div");
  const restartButton = document.createElement("button");
  const finalScore = document.createElement("div");
  const exclamation = document.createElement("div");
  exclamation.classList.add("exclamation");
  restartButton.classList.add("restart");
  finalScore.classList.add("final_score");
  finalScore.appendChild(exclamation);
  finishDisplay.classList.add("finish");
  exclamation.innerHTML = outcome;
  restartButton.innerHTML = "restart";
  restartButton.addEventListener("click", () => document.location.reload());
  finalScore.innerHTML = "Score: " + score;
  finishDisplay.append(exclamation, finalScore, restartButton);
  emptyContainer(grid);
  grid.appendChild(finishDisplay);

  document.addEventListener("keydown", (e) => {
    console.log(e.key);
    if (e.key == "Enter" || e.key == " ") document.location.reload();
  });
}
