import express from 'express';
import myDB from '../database/db.js';

const router = express.Router();

router.post('/response', async (req, res) => {
    const responseData = req.body;
    try {
        const result = await myDB.insertResponse(responseData);
        res.status(201).json({ success: true, responseId: result.insertedId });
    } catch (error) {
        console.error('Error saving response:', error);
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