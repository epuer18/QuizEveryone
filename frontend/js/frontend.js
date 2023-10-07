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
      const correctAnswer = document.querySelector('input[name="trueFalseOption"]:checked');
      if (!correctAnswer) {
        alert('Please select a correct answer.');
        return;
      }
      question = {
        questionText,
        questionType,
        correctAnswer: correctAnswer.value,
        id: questionCounter
      };
    } else if (questionType === 'multipleChoice') {
      const option1 = document.getElementById('option1').value;
      const option2 = document.getElementById('option2').value;
      const correctOption = document.getElementById('correctOption').value;

      question = {
        questionText,
        questionType,
        options: [option1, option2],
        correctAnswer: correctOption,
        id: questionCounter
      };
    } else { // blankFilling
      const correctAnswer = document.getElementById('correctAnswer').value;
      
      question = {
        questionText,
        questionType,
        correctAnswer,
        id: questionCounter
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
    <div>
      Question ${question.id} (${questionTypeLabel}): ${question.questionText}
    </div>
    ${question.options ? `<div>Options: ${question.options.join(', ')}</div>` : ''}
    <div>
      Correct Answer: ${question.correctAnswer}
    </div>
    <hr>
  `;
  questionsContainer.appendChild(questionDiv);
}

function clearInputFields() {
  document.getElementById('questionText').value = '';
  document.getElementById('option1').value = '';
  document.getElementById('option2').value = '';
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


