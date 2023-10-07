async function createQuiz() {
    console.log("call from frontend")
    const url = '/api/quizzes/creatquiz'; // Update this URL if your endpoint is different
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      console.log('Quiz created with ID:', data.quizId);
    } catch (error) {
      console.error('Error creating quiz:', error);
    }
  }

  createQuiz();