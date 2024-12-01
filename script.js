const car = document.querySelector('.car');
const road = document.querySelector('.road');
const scoreElement = document.getElementById('score');
const questionElement = document.getElementById('question');

let positionX = 125; // Car starts in the left lane
let score = 0;
let correctAnswer = 0;
let gameRunning = true;

// Clear all previous answers before generating new ones
function clearPreviousAnswers() {
    const answers = document.querySelectorAll('.answer');
    answers.forEach(answer => answer.remove());
}

// Generate random math quiz
function generateQuiz() {
    clearPreviousAnswers(); // Remove previous answers

    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const wrongAnswer = Math.floor(Math.random() * 20) + 1;

    correctAnswer = num1 + num2;
    questionElement.textContent = `What is ${num1} + ${num2}?`;

    // Randomly select lane for correct answer
    const isLeftLane = Math.random() < 0.5; // 50% chance for left lane

    if (isLeftLane) {
        createAnswer(correctAnswer, true, 125);  // Left lane
        createAnswer(wrongAnswer !== correctAnswer ? wrongAnswer : wrongAnswer + 1, false, 225);  // Right lane
    } else {
        createAnswer(wrongAnswer !== correctAnswer ? wrongAnswer : wrongAnswer + 1, false, 125);  // Left lane
        createAnswer(correctAnswer, true, 225);  // Right lane
    }
}



function createAnswer(value, isCorrect, lanePosition) {
    const answerDiv = document.createElement('div');
    answerDiv.classList.add('answer');
    answerDiv.textContent = value;
    answerDiv.style.left = `${lanePosition}px`;

    road.appendChild(answerDiv);

    // Move answers down and check collision
    const moveInterval = setInterval(() => {
        if (!gameRunning) {
            clearInterval(moveInterval);
            answerDiv.remove();
            return;
        }

        const topPosition = parseInt(window.getComputedStyle(answerDiv).getPropertyValue('top')) || 0;

        if (checkCollision(car, answerDiv)) {
            clearInterval(moveInterval);
            answerDiv.remove();
            if (isCorrect) {
                score++;
                scoreElement.textContent = score;
            } else {
                endGame();
            }
        }

        if (topPosition > 600) {
            clearInterval(moveInterval);
            answerDiv.remove();
        }
    }, 30);
}

// Collision detection
function checkCollision(car, answer) {
    const carRect = car.getBoundingClientRect();
    const answerRect = answer.getBoundingClientRect();

    return !(
        carRect.top > answerRect.bottom ||
        carRect.bottom < answerRect.top ||
        carRect.left > answerRect.right ||
        carRect.right < answerRect.left
    );
}

// Move car between lanes
function moveLeft() {
    if (positionX === 225) positionX = 125;
    car.style.left = `${positionX}px`;
}

function moveRight() {
    if (positionX === 125) positionX = 225;
    car.style.left = `${positionX}px`;
}

// End the game
function endGame() {
    gameRunning = false;
    questionElement.textContent = 'Game Over!';
    alert(`Game Over! Your final score is ${score}`);
    window.location.reload(); // Reload the game
}

// Listen for key presses
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') moveLeft();
    if (e.key === 'ArrowRight') moveRight();
});

// Start the game
if (gameRunning) {
    setInterval(generateQuiz, 2500);
}
