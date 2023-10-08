let questions = [];
let questionCounter = 1;

function toggleOptions() {
  const questionType = document.getElementById('questionType').value;
  const answerOptions = document.getElementById('answerOptions');
  const trueOrFalse = document.getElementById('trueOrFalse');
  const fillBlank = document.getElementById('fillBlank');

  if (questionType === 'multipleChoice') {
    answerOptions.style.display = 'block';
    trueOrFalse.style.display = 'none';
    fillBlank.style.display = 'none';
  }else if(questionType === 'trueFalse'){
    trueOrFalse.style.display = 'block';
    fillBlank.style.display = 'none';
    answerOptions.style.display = 'none';
  }else if(questionType === 'blankFilling'){
    fillBlank.style.display = 'block';
    answerOptions.style.display = 'none';
    trueOrFalse.style.display = 'none';
  } else {
    answerOptions.style.display = 'none';
    trueOrFalse.style.display = 'none';
    fillBlank.style.display = 'none';
  }
}

function addQuestion() {
  const questionText = document.getElementById('questionText').value;
  const questionType = document.getElementById('questionType').value;

  if (questionText && questionType) {
    let question;
    
    if (questionType === 'trueFalse') {
      const correctAnswer = document.getElementById('trueFalseAnswer').value;
      if (!correctAnswer) {
        alert('Please select a correct answer.');
        return;
      }
      question = {
        questionText,
        questionType,
        correctAnswer: correctAnswer,
        number: questionCounter
      };
    } else if (questionType === 'multipleChoice') {
      const option1 = document.getElementById('option1').value;
      const option2 = document.getElementById('option2').value;
      const option3 = document.getElementById('option3').value;
      const correctOption = document.getElementById('correctOption').value;

      question = {
        questionText,
        questionType,
        options: [option1, option2, option3],
        correctAnswer: correctOption,
        number: questionCounter
      };
    } else { // blankFilling
      const correctAnswer = document.getElementById('fillBlankAnswer').value;
      
      question = {
        questionText,
        questionType,
        correctAnswer,
        number: questionCounter
      };
    }

    questions.push(question);
    
    // Increment the question counter for a unique ID for each question
    questionCounter++;

    // Display the added question
    displayQuestion(question);
    alert('Question added successfully.');

    // Clear the input fields
    clearInputFields();
  } else {
    alert('Please enter all question details.');
  }
}

function displayQuestion(question) {
  const questionsContainer = document.getElementById('questionsContainer');
  const questionDiv = document.createElement('div');
  
  let questionTypeLabel = '';
  if (question.questionType === 'trueFalse') {
    questionTypeLabel = 'True/False';
  } else if (question.questionType === 'multipleChoice') {
    questionTypeLabel = 'Multiple Choice';
  } else { // blankFilling
    questionTypeLabel = 'Blank Filling';
  }

  questionDiv.innerHTML = `
    <div class = "questionBody">
      Question ${question.number} (${questionTypeLabel}): ${question.questionText}
    </div>
    ${question.options ? `<div class="options">Options: ${question.options.join(', ')}</div>` : ''}
    <div class = "answerBody">
      Correct Answer: ${question.correctAnswer}
    </div>
    <hr class = "questionLine">
  `;
  questionsContainer.appendChild(questionDiv);
}

function clearInputFields() {
  document.getElementById('questionText').value = '';
  document.getElementById('option1').value = '';
  document.getElementById('option2').value = '';
  document.getElementById('option3').value = '';
  document.getElementById('correctAnswer').value = '';

  // Reset radio button selection for true/false
  const trueFalseOptions = document.querySelectorAll('input[name="trueFalseOption"]');
  for (const option of trueFalseOptions) {
    option.checked = false;
  }

  // Reset dropdown selection for multiple choice
  const correctOption = document.getElementById('correctOption');
  correctOption.selectedIndex = 0;
}


async function submitQuiz() {
    if (questions.length === 0) {
      alert('Please add at least one question to submit the quiz.');
      return;
    }
  
    // Here, you can make a POST request to your server
    // with the 'questions' array to save the quiz in the database
    const url = '/api/quizzes/create'; // Update this URL if your endpoint is different

    const currQuiz = { 
        quiz: questions,
        title: "sample quiz",
        description: "A simple quiz"
    }
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currQuiz),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      console.log('Quiz created with ID:', data.quizId);

      window.location.href = `http://localhost:3000/quizPage.html?quizId=${data.quizId}`;
    } catch (error) {
      console.error('Error creating quiz:', error);
    }
    console.log('Submitting quiz to the server:', questions);
  
    // Clear the questions and reset the counter after submitting the quiz
    questions = [];
    questionCounter = 1;
  
    // Clear the displayed questions on the page
    const questionsContainer = document.getElementById('questionsContainer');
    questionsContainer.innerHTML = '';
  }