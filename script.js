document.addEventListener("DOMContentLoaded", function() {
  let currentQuestion = 0;
  let score = 0;
  let timeRemaining = 60; // Set your desired quiz time in seconds
  let timerInterval; // Variable to hold the timer interval

  const questionText = document.getElementById("question-text");
  const optionsContainer = document.getElementById("options-container");
  const resultsContainer = document.getElementById("results-container");
  const nextButton = document.getElementById("next-button");
  const startButton = document.getElementById("start-button");

  function loadQuestion() {
      const question = questions[currentQuestion];
      questionText.textContent = question.question;
      optionsContainer.innerHTML = '';

      question.options.forEach((option, index) => {
          const optionElement = document.createElement("div");
          optionElement.textContent = option;
          optionElement.addEventListener("click", () => checkAnswer(index));
          optionsContainer.appendChild(optionElement);
      });

      if (currentQuestion === 0) {
          startTimer();
      }
  }

  function startTimer() {
      timerInterval = setInterval(function () {
          timeRemaining--;
          resultsContainer.textContent = `Time Remaining: ${timeRemaining}s`;

          if (timeRemaining <= 0) {
              clearInterval(timerInterval);
              showResult();
          }
      }, 1000);
  }

  function checkAnswer(selectedIndex) {
      const question = questions[currentQuestion];
      if (question.options[selectedIndex] === question.answer) {
          score++;
      }

      currentQuestion++;

      if (currentQuestion < questions.length) {
          loadQuestion();
      } else {
          showResult();
      }
  }

  function showResult() {
      clearInterval(timerInterval); // Stop the timer
      questionText.textContent = "Quiz finished!";
      optionsContainer.innerHTML = '';
      nextButton.style.display = 'none';
      resultsContainer.textContent = `Your score: ${score} out of ${questions.length}`;

      // Assign a grade based on the score (you can customize this grading scale)
      let grade;
      if (score === questions.length) {
          grade = "A+";
      } else if (score >= Math.floor(0.9 * questions.length)) {
          grade = "A";
      } else if (score >= Math.floor(0.8 * questions.length)) {
          grade = "B";
      } else if (score >= Math.floor(0.7 * questions.length)) {
          grade = "C";
      } else if (score >= Math.floor(0.6 * questions.length)) {
          grade = "D";
      } else {
          grade = "F";
      }

      // Prompt the user for initials
      const userInitials = prompt("Enter your initials:");

      // Save the score, initials, and grade to local storage
      const highScores = JSON.parse(localStorage.getItem("highScores")) || [];
      highScores.push({ initials: userInitials, score: score, grade: grade });
      localStorage.setItem("highScores", JSON.stringify(highScores));

      // Display high scores or perform other actions as needed
      displayHighScores();
  }

  function displayHighScores() {
      // Retrieve high scores from local storage and display them
      const highScores = JSON.parse(localStorage.getItem("highScores")) || [];
      resultsContainer.textContent = "\nHigh Scores:\n";

      // Filter out entries with missing or invalid data
      const validEntries = highScores.filter(entry => entry.initials && typeof entry.score === 'number' && entry.grade);

      validEntries.forEach((entry) => {
          resultsContainer.textContent += `${entry.initials}: ${entry.score} (${entry.grade})\n`;
      });
  }

  startButton.addEventListener("click", loadQuestion);

  // Initially, hide the quiz elements
  questionText.style.display = 'none';
  optionsContainer.style.display = 'none';
  nextButton.style.display = 'none';

  // Show the quiz elements when the "Start Quiz" button is clicked
  startButton.addEventListener("click", function() {
      startButton.style.display = 'none';
      questionText.style.display = 'block';
      optionsContainer.style.display = 'block';
      nextButton.style.display = 'block';
  });
});
