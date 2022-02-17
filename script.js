const grid = document.querySelector(".grid");
const blockWidth = 100;
const blockHeight = 20;
const boardWidth = 560;
const boardHeight = 300;
const ballDiameter = 20;
const ballRadius = ballDiameter / 2;
let timerId;

let xDirection = 2;
let yDirection = 2;

// up + right = 6 || up +left = 2 || down +right = -2 || down + left = -6
let directionCode;

function calculateDirectionCode(){
  directionCode = xDirection + ( 2 * yDirection)
}

const userStart = 230;
let currentPosition = userStart;

const ballStart = [270, 32];
let currentBallPosition = ballStart;

// Create Block
class Block {
  constructor(xAxis, yAxis) {
    this.bottomLeft = [xAxis, yAxis];
    this.bottomRight = [xAxis + blockWidth, yAxis];
    this.topLeft = [xAxis, yAxis + blockHeight];
    this.topRight = [xAxis + blockWidth, yAxis + blockHeight];
  }
}

//All my Blocks
const blocks = [
  new Block(10, 270),
  new Block(120, 270),
  new Block(230, 270),
  new Block(340, 270),
  new Block(450, 270),
  new Block(10, 240),
  new Block(120, 240),
  new Block(230, 240),
  new Block(340, 240),
  new Block(450, 240),
  new Block(10, 210),
  new Block(120, 210),
  new Block(230, 210),
  new Block(340, 210),
  new Block(450, 210),
];

// Draw my Block
function addBlock() {
  for (let i = 0; i < blocks.length; i++) {
    const block = document.createElement("div");
    block.classList.add("block");
    block.style.left = blocks[i].bottomLeft[0] + "px";
    block.style.bottom = blocks[i].bottomLeft[1] + "px";
    grid.appendChild(block);
  }
}

addBlock();

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
        currentPosition -= 10;
        drawUser();
      }
      break;
    case "ArrowRight":
      if (currentPosition < boardWidth - blockWidth) {
        currentPosition += 10;
        drawUser();
      }
      break;
  }
}

document.addEventListener("keydown", moveUser);

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
  drawBall();
  checkForCollisions();
}

timerId = setInterval(moveBall, 30);

function checkForCollisions() {
  checkForBlockCollisions();
  checkForWallCollisions();
  checkForUserCollision();
  checkForGameOver();
}

function checkForBlockCollisions(){
   for ( let i = 0; i < blocks.length; i++) {
      if (
        ((currentBallPosition[0] - ballDiameter) >= blocks[i].bottomLeft[0] &&
        currentBallPosition[0] < blocks[i].bottomRight[0]) &&
        ((currentBallPosition[1] + ballDiameter) > blocks[i].bottomLeft[1] &&
        currentBallPosition[1] < blocks[i].topLeft[1])
      ) {
        console.log(`collision with block ${i}`);
        const allBlocks = Array.from(document.querySelectorAll('.block'))
        allBlocks[i].classList.remove('block')
        blocks.splice(i, 1)
        calculateDirectionCode();
      }
  }
}


function checkForWallCollisions(){
  if (
    currentBallPosition[0] >= boardWidth - ballDiameter ||
    currentBallPosition[0] < 0
  ) {
    xDirection = -xDirection;
    calculateDirectionCode();
    return;
  }
  if (currentBallPosition[1] >= boardHeight - ballDiameter) {
    yDirection = -yDirection;
    calculateDirectionCode();
    return
  }
}

function checkForUserCollision(){
  if (currentBallPosition[1] >= 30) return
  if (
    currentBallPosition[0] - ballDiameter >= currentPosition &&
    currentBallPosition[0] <= currentPosition + blockWidth
  ) {
    yDirection = -yDirection;
    calculateDirectionCode();
    return;
  }
  if (
    (currentBallPosition[0] + ballDiameter === currentPosition &&
      directionCode === -2) ||
    (currentBallPosition[0] === currentPosition + blockWidth &&
      directionCode === -6)
  ) {
    xDirection = -xDirection;
    calculateDirectionCode();
    return;
  }
}

function checkForGameOver(){
  if (currentBallPosition[1] > 0) return
  clearInterval(timerId);
  alert("Game Over");
}