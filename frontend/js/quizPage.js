const quizPage = (function () {
  let questions = [];

  async function getQuiz() {
    const urlParams = new URLSearchParams(window.location.search);
    const quizId = urlParams.get("quizId");
    fetch(`/api/quizzes/id?id=${quizId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Quiz fetched successfully:", data);
        displayQuiz(data);
        questions = data.quiz;
      })
      .catch((error) => {
        console.error("Error fetching quiz:", error);
        alert("An error occurred while fetching the quiz.");
      });
  }

  function displayQuiz(data) {
    const quizContainer = document.getElementById("quizContainer");

    quizContainer.innerHTML = "";

    data.quiz.forEach((question, index) => {
      const questionDiv = document.createElement("div");
      questionDiv.innerHTML = `
        <h3>Question ${index + 1}</h3>
        <p>${question.questionText}</p>
        ${
          question.options
            ? `<fieldset id="question${index}" class="question-fieldset">
        ${question.options
          .map(
            (option, optionIndex) => `
          <label>
            <input type="radio" name="question${index}" value="${option}" id="option${
              optionIndex + 1
            }" ${optionIndex === question.correctAnswer ? "checked" : ""}>
            ${option}
          </label>
        `,
          )
          .join("")}
      </fieldset>`
            : ""
        }
      ${
        question.questionType === "trueFalse"
          ? `  <div id="studentAnswer" class="trueOrFalse">
      <label for="studentAnswer">Your Answer:</label>
      <select id="trueFalseAnswer${index}">
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
    </div>`
          : ""
      }
    ${
      question.questionType === "blankFilling"
        ? `<div id="studentAnswer" class="fillBlank">
    <label for="studentAnswer">Your Answer:</label>
    <input type="text" id="fillBlankAnswer${index}" >
  </div>`
        : ""
    }
        <hr class = "questionLine">
      `;
      quizContainer.appendChild(questionDiv);
    });
  }

  async function submitQuiz() {
    const studentId = document.getElementById("studentId").value;
    const studentName = document.getElementById("studentName").value;

    if (!studentId || !studentName) {
      alert("Please enter Student ID and Name.");
      return;
    }

    const quizResponses = [];

    questions.forEach((question, index) => {
      let selectedOption = document.querySelector(
        `input[name="question${index}"]:checked`,
      );
      let trueFalseAnswer = document.getElementById(`trueFalseAnswer${index}`);
      let fillBlankAnswer = document.getElementById(`fillBlankAnswer${index}`);
      // console.log(selectedOption);
      // console.log(question);
      if (selectedOption) {
        quizResponses.push({
          question: question.questionText,
          answer: question.correctAnswer,
          response: selectedOption.id,
        });
      } else if (trueFalseAnswer) {
        quizResponses.push({
          question: question.questionText,
          answer: question.correctAnswer,
          response: trueFalseAnswer.value,
        });
      } else if (fillBlankAnswer) {
        console.log(fillBlankAnswer.value);
        quizResponses.push({
          question: question.questionText,
          answer: question.correctAnswer,
          response: fillBlankAnswer.value.toLowerCase(),
        });
      } else {
        quizResponses.push({
          question: question.questionText,
          response: "Not answered",
        });
      }
    });

    const quizData = {
      studentId,
      studentName,
      quizResponses,
    };
    try {
      const response = await fetch("/api/responses/response", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(quizData),
      });

      const data = await response.json();
      console.log(data);
      if (data.success) {
        alert("Quiz submitted successfully!");
        console.log(data.responseId);
        fetchFeedback(data.responseId);
      } else {
        alert("Error submitting the quiz. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
      alert("An error occurred while submitting the quiz.");
    }
  }

  function copyLinkToClipboard() {
    const textArea = document.createElement("textarea");
    textArea.value = window.location.href;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    alert("Quiz link copied to clipboard!");
  }

  async function fetchFeedback(responseId) {
    try {
      const response = await fetch(
        `/api/responses/feedback/responseId?responseId=${responseId}`,
      );
      const data = await response.json();

      if (data.success) {
        const feedbackContainer = document.getElementById("feedbackContainer");
        const feedbackDiv = document.createElement("div");

        let detailedFeedbackHtml = "";
        data.feedback.forEach((item) => {
          detailedFeedbackHtml += `
                <div class="question-feedback ${
                  item.isCorrect
                    ? "correct-answer-container"
                    : "wrong-answer-container"
                }">
                <p><strong>Question:</strong> ${item.question}</p>
                <p class="${
                  item.isCorrect ? "correct-answer" : "wrong-answer"
                }"><strong>Your Answer:</strong> ${item.studentAnswer}</p>
                ${
                  !item.isCorrect
                    ? `<p class="correct-answer-text"><strong>Correct Answer:</strong> ${item.correctAnswer}</p>`
                    : ""
                }
            </div>
            `;
        });
        const submitButton = document.getElementById("submitQuiz");
        submitButton.style.display = "none";

        feedbackDiv.innerHTML = `
              ${detailedFeedbackHtml}
              <div class="feedback-summary">
                  <h2>Overall Feedback</h2>
                  <p class="percentage-result"><strong>Percentage Correct: ${parseFloat(
                    data.percentageCorrect,
                  ).toFixed(2)}</strong>%</p>
              </div>
            `;

        const feedbackHead = feedbackContainer.querySelector(".feedbackHead");
        feedbackContainer.insertBefore(feedbackDiv, feedbackHead.nextSibling);
      } else {
        alert("Error fetching feedback.");
      }
    } catch (error) {
      console.error("Error fetching feedback:", error);
      alert("An error occurred while fetching feedback.");
    }
  }

  getQuiz();
  document
    .getElementById("copyLink")
    .addEventListener("click", copyLinkToClipboard);
  document.getElementById("submitQuiz").addEventListener("click", submitQuiz);
})();
