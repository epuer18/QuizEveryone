async function getQuiz(){
    console.log("youmeiyou")
    const urlParams = new URLSearchParams(window.location.search);
    const quizId = urlParams.get('quizId');
    fetch(`/api/quizzes/id?id=${quizId}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('Quiz fetched successfully:', data);
      // Handle displaying the fetched quiz data on the webpage
      displayQuiz(data);
    })
    .catch(error => {
      console.error('Error fetching quiz:', error);
      alert('An error occurred while fetching the quiz.');
    });
}

function displayQuiz(quiz) {
    // Display the quiz on the webpage based on the received data
    // Modify this function to suit your specific display requirements
    console.log('Displaying quiz:', quiz);
  }

  getQuiz();