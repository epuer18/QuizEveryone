import express from 'express';
import myDB from '../database/db.js';

const router = express.Router();

router.post('/submit/quizId', async (req, res) => {
    try {
        const response = {
            quizId: req.params.quizId,
            answers: req.body.answers,
            name: req.body.name,
            email: req.body.email,
            timestamp: new Date()
        };

        const result = await myDB.insertResponse(response);

        res.status(201).json({ success: true, responseId: result.insertedId });
    } catch (error) {
        console.error('Error recording quiz response:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});


router.get('/results/responseId', async (req, res) => {
    try {
        const responseId = req.params.responseId;
        const response = await myDB.getResponseById(responseId);
        const quiz = await myDB.getQuizById(response.quizId);
        
        const studentAnswers = response.answers;
        const correctAnswers = quiz.questions.map(q => q.correctAnswer);
        let correctCount = 0;

        for (let i = 0; i < studentAnswers.length; i++) {
            if (studentAnswers[i] === correctAnswers[i]) {
                correctCount++;
            }
        }
        const percentageCorrect = (correctCount / studentAnswers.length) * 100;

        res.render('resultsPage', { percentage: percentageCorrect });

    } catch (error) {
        console.error('Error fetching results:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

export default router;