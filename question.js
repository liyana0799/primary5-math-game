// Get topic from URL
const urlParams = new URLSearchParams(window.location.search);
const topic = urlParams.get('topic') || 'add';

let score = 0;
let correctAnswer = 0;
let timeLeft = 60;

const timerEl = document.getElementById('timer');
const scoreText = document.getElementById('scoreText');
const questionText = document.getElementById('questionText');
const answerInput = document.getElementById('answerInput');
const feedback = document.getElementById('feedback');
const submitBtn = document.getElementById('submitBtn');
const homeBtn = document.getElementById('homeBtn');

// Load audio files from Dropbox links
const correctSound = new Audio('Pictures%20%26%20Sounds/correct%20sound%20effect.mp3');
const wrongSound   = new Audio('Pictures%20%26%20Sounds/wrong%20sound%20effect.mp3');

// Timer countdown
const timerInterval = setInterval(() => {
  timeLeft--;
  timerEl.textContent = `Time Left: ${timeLeft}s`;
  if(timeLeft <= 0){
    endGame();
  }
}, 1000);

// Restrict input for different topics
answerInput.addEventListener('input', () => {
  if(topic === "sub"){ // allow negative
    answerInput.value = answerInput.value.replace(/(?!^-)[^0-9]/g, '');
  } else if(topic === "money"){ // allow decimal
    answerInput.value = answerInput.value.replace(/[^0-9.]/g, '');
  } else if(topic === "clock"){ // allow digits and colon
    answerInput.value = answerInput.value.replace(/[^0-9:]/g, '');
  } else { // other topics positive integers only
    answerInput.value = answerInput.value.replace(/[^0-9]/g, '');
  }
});

function getNumber() {
  return Math.floor(Math.random() * 50) + 1;
}

function generateQuestion() {
  const num1 = getNumber();
  const num2 = getNumber();

  if(topic === "add"){
    questionText.textContent = `${num1} + ${num2} = ?`;
    correctAnswer = num1 + num2;
  } else if(topic === "sub"){
    questionText.textContent = `${num1} - ${num2} = ?`;
    correctAnswer = num1 - num2;
  } else if(topic === "mul"){
    questionText.textContent = `${num1} × ${num2} = ?`;
    correctAnswer = num1 * num2;
  } else if(topic === "div"){
    const product = num1 * num2;
    questionText.textContent = `${product} ÷ ${num1} = ?`;
    correctAnswer = num2;
  } else if(topic === "money"){
    // Money question with RM and cents
    const rm1 = Math.floor(Math.random() * 20); // 0-19 RM
    const sen1 = Math.floor(Math.random() * 100); // 0-99 sen
    const rm2 = Math.floor(Math.random() * 20);
    const sen2 = Math.floor(Math.random() * 100);

    const total = (rm1 + rm2) + ((sen1 + sen2)/100);
    questionText.textContent = `If you have RM${rm1}.${sen1 < 10 ? '0'+sen1 : sen1} and RM${rm2}.${sen2 < 10 ? '0'+sen2 : sen2}, how much do you have in total? (in RM)`;
    correctAnswer = parseFloat(total.toFixed(2));
  } else if(topic === "clock"){
    // Clock question with AM/PM and 24-hour conversion
    const hour12 = Math.floor(Math.random()*12)+1; // 1-12
    const minute = Math.floor(Math.random()*60);
    const isPM = Math.random() < 0.5; // 50% chance
    const hour24 = isPM ? (hour12 === 12 ? 12 : hour12 + 12) : (hour12 === 12 ? 0 : hour12);
    questionText.textContent = `What time is it if the clock shows ${hour12}:${minute < 10 ? '0'+minute : minute} ${isPM ? 'PM' : 'AM'}? (Write in 24-hour format HH:MM)`;
    correctAnswer = `${hour24 < 10 ? '0'+hour24 : hour24}:${minute < 10 ? '0'+minute : minute}`;
  }

  answerInput.value = '';
  feedback.textContent = '';
}

submitBtn.addEventListener('click', () => {
  let userAnswer = answerInput.value.trim();

  if(topic === "money"){
    userAnswer = parseFloat(userAnswer);
    if(userAnswer === correctAnswer){
      feedback.textContent = "Correct!";
      feedback.style.color = "green";
      score++;
      correctSound.play();
    } else {
      feedback.textContent = `Wrong! Correct answer is RM${correctAnswer.toFixed(2)}`;
      feedback.style.color = "red";
      wrongSound.play();
    }
  } else if(topic === "clock"){
    if(userAnswer === correctAnswer){
      feedback.textContent = "Correct!";
      feedback.style.color = "green";
      score++;
      correctSound.play();
    } else {
      feedback.textContent = `Wrong! Correct answer is ${correctAnswer}`;
      feedback.style.color = "red";
      wrongSound.play();
    }
  } else { // other topics
    userAnswer = Number(userAnswer);
    if(userAnswer === correctAnswer){
      feedback.textContent = "Correct!";
      feedback.style.color = "green";
      score++;
      correctSound.play();
    } else {
      feedback.textContent = `Wrong! Correct answer is ${correctAnswer}`;
      feedback.style.color = "red";
      wrongSound.play();
    }
  }

  updateScore();
  setTimeout(generateQuestion, 1000);
});

function updateScore(){
  scoreText.textContent = `Score: ${score}`;
}

function endGame(){
  clearInterval(timerInterval);
  feedback.textContent = `Game Over! Your final score is: ${score}`;
  feedback.style.color = "#003366";
  questionText.textContent = '';
  answerInput.style.display = 'none';
  submitBtn.style.display = 'none';
  homeBtn.classList.remove('hidden');
}

function returnHome(){
  window.location.href = 'index.html';
}

// Start the first question
generateQuestion();
updateScore();


