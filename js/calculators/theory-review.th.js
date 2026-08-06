function checkAnswer(button, isCorrect) {
  const questionItem = button.closest("li");
  const buttons = questionItem.querySelectorAll(".cdc-quiz__button");
  const answerDiv = questionItem.querySelector(".cdc-quiz__answer");
  const userAnswer = button.getAttribute("data-answer") === "true";

  // Disable all buttons in this question
  buttons.forEach((btn) => {
    btn.classList.add("disabled");
    btn.onclick = null;
  });

  // Mark the clicked button
  if (userAnswer === isCorrect) {
    button.classList.add("correct");
    answerDiv.classList.add("correct-answer");
  } else {
    button.classList.add("incorrect");
    answerDiv.classList.add("incorrect-answer");
    // Also mark the correct button
    buttons.forEach((btn) => {
      if (btn.getAttribute("data-answer") === (isCorrect ? "true" : "false")) {
        btn.classList.add("correct");
      }
    });
  }

  // Show the answer explanation
  answerDiv.classList.add("show");
}
