const create = (function () {
  let questions = [];
  let questionCounter = 1;
  const urlParams = new URLSearchParams(window.location.search);
  const quizId = urlParams.get("quizId");

  if (quizId) {
    getQuiz(quizId);
    document.getElementById("submit").style.display = "none";
  } else {
    document.getElementById("jump").style.display = "none";
    document.getElementById("delete").style.display = "none";
    document.getElementById("update").style.display = "none";
  }

  function toggleOptions() {
    const questionType = document.getElementById("questionType").value;
    const answerOptions = document.getElementById("answerOptions");
    const trueOrFalse = document.getElementById("trueOrFalse");
    const fillBlank = document.getElementById("fillBlank");

    if (questionType === "multipleChoice") {
      answerOptions.style.display = "block";
      trueOrFalse.style.display = "none";
      fillBlank.style.display = "none";
    } else if (questionType === "trueFalse") {
      trueOrFalse.style.display = "block";
      fillBlank.style.display = "none";
      answerOptions.style.display = "none";
    } else if (questionType === "blankFilling") {
      fillBlank.style.display = "block";
      answerOptions.style.display = "none";
      trueOrFalse.style.display = "none";
    } else {
      answerOptions.style.display = "none";
      trueOrFalse.style.display = "none";
      fillBlank.style.display = "none";
    }
  }

  function addQuestion() {
    const questionText = document.getElementById("questionText").value;
    const questionType = document.getElementById("questionType").value;

    if (questionText && questionType) {
      let question;

      if (questionType === "trueFalse") {
        const correctAnswer = document.getElementById("trueFalseAnswer").value;
        if (!correctAnswer) {
          alert("Please select a correct answer.");
          return;
        }
        question = {
          questionText,
          questionType,
          correctAnswer: correctAnswer,
          number: questionCounter,
        };
      } else if (questionType === "multipleChoice") {
        const option1 = document.getElementById("option1").value;
        const option2 = document.getElementById("option2").value;
        const option3 = document.getElementById("option3").value;
        const correctOption = document.getElementById("correctOption").value;

        question = {
          questionText,
          questionType,
          options: [option1, option2, option3],
          correctAnswer: correctOption,
          number: questionCounter,
        };
      } else {
        const correctAnswerRaw =
          document.getElementById("fillBlankAnswer").value;
        const correctAnswer = correctAnswerRaw.toLowerCase();

        question = {
          questionText,
          questionType,
          correctAnswer,
          number: questionCounter,
        };
      }

      questions.push(question);

      questionCounter++;

      displayQuestion(question);
      alert("Question added successfully.");

      clearInputFields();
    } else {
      alert("Please enter all question details.");
    }
  }

  function displayQuestion(question) {
    const questionsContainer = document.getElementById("questionsContainer");
    const questionDiv = document.createElement("div");

    let questionTypeLabel = "";
    if (question.questionType === "trueFalse") {
      questionTypeLabel = "True/False";
    } else if (question.questionType === "multipleChoice") {
      questionTypeLabel = "Multiple Choice";
    } else {
      questionTypeLabel = "Blank Filling";
    }

    questionDiv.innerHTML = `
    <div class = "questionBody">
      Question ${question.number} (${questionTypeLabel}): ${
        question.questionText
      }
    </div>
    ${
      question.options
        ? `<div class="options">Options: ${question.options.join(", ")}</div>`
        : ""
    }
    <div class = "answerBody">
      Correct Answer: ${question.correctAnswer}
    </div>
    <hr class = "questionLine">
  `;
    questionsContainer.appendChild(questionDiv);

    const updateButton = document.getElementById("update");
    const deleteButton = document.getElementById("delete");

    questionsContainer.appendChild(updateButton);
    questionsContainer.appendChild(deleteButton);
  }

  function clearInputFields() {
    document.getElementById("questionText").value = "";
    document.getElementById("option1").value = "";
    document.getElementById("option2").value = "";
    document.getElementById("option3").value = "";
    document.getElementById("correctAnswer").value = "";

    const trueFalseOptions = document.querySelectorAll(
      'input[name="trueFalseOption"]',
    );
    for (const option of trueFalseOptions) {
      option.checked = false;
    }

    const correctOption = document.getElementById("correctOption");
    correctOption.selectedIndex = 0;
  }

  async function getQuiz(quizId) {
    fetch(`/api/quizzes/id?id=${quizId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Quiz fetched successfully:", data);
        questions = data.quiz;
        questions.forEach(displayQuestion);
        questionCounter += questions.length;
      })
      .catch((error) => {
        console.error("Error fetching quiz:", error);
        alert("An error occurred while fetching the quiz.");
      });
  }

  async function submitQuiz() {
    if (questions.length === 0) {
      alert("Please add at least one question to submit the quiz.");
      return;
    }

    const url = "/api/quizzes/create";

    const currQuiz = {
      quiz: questions,
      title: "Created Quiz",
      description: "The created quiz",
    };
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(currQuiz),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Quiz created with ID:", data.quizId);
      alert(
        "Quiz created successfully! You can add more questions or jump to the quiz page.",
      );
      window.location.href = `/create.html?quizId=${data.quizId}`;
    } catch (error) {
      console.error("Error creating quiz:", error);
    }
    console.log("Submitting quiz to the server:", questions);
  }

  async function updateQuiz() {
    const url = `/api/quizzes/id?id=${quizId}`;

    const currQuiz = {
      quiz: questions,
      title: "Updated Quiz",
      description: "The updated quiz",
    };
    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(currQuiz),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Quiz update with ID:", quizId);
      alert("Quiz updated successfully.");
    } catch (error) {
      console.error("Error creating quiz:", error);
    }
    console.log("Submitting quiz to the server:", questions);
  }

  async function deleteQuiz() {
    const endpoint = `/api/quizzes/id?id=${quizId}`;
    fetch(endpoint, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          console.log("Quiz deleted successfully");
          alert("Quiz deleted successfully.");
          window.location.href = `/create.html`;
        } else {
          console.error("Quiz deletion failed:", data.message);
        }
      })
      .catch((error) => {
        console.error("Error deleting quiz:", error);
      });
  }

  function jumpToQuizPage() {
    if (quizId) {
      window.location.href = `/quizPage.html?quizId=${quizId}`;
    } else {
      alert("Please create quiz first.");
    }
  }

  document
    .getElementById("questionType")
    .addEventListener("change", toggleOptions);
  document.getElementById("addQuestion").addEventListener("click", addQuestion);
  document.getElementById("submit").addEventListener("click", submitQuiz);
  document.getElementById("jump").addEventListener("click", jumpToQuizPage);
  document.getElementById("update").addEventListener("click", updateQuiz);
  document.getElementById("delete").addEventListener("click", deleteQuiz);
})();
