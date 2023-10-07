import express from 'express';
import myDB from '../database/db.js';

const router = express.Router();

<<<<<<< Updated upstream

router.post('/create', async (req, res) => {
    try {
        const result = await myDB.insertQuiz(req.body);
        res.status(201).json({ success: true, quizId: result.insertedId });
=======
router.post('/create', async (req, res) => {
    try {
        const db = await connect();

        const quiz1 = {
            title: "Quiz1 Test",
            description: "A quiz1 example",
            questions: [
                {
                    type: "quiz",
                    questionText: "What's the capital of France?",
                    options: ["London", "Berlin", "Paris", "Rome"],
                    correctAnswer: "Paris"
                },
            ],
            responses: []
        };

        // Insert the quiz object into the 'quizzes' collection
        const result = await db.collection('mcq').insertOne(quiz1);

        res.json({ success: true, quizId: result.insertedId });
>>>>>>> Stashed changes
    } catch (error) {
        console.error('Error creating quiz:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

// Retrieve a specific quiz by its ID
router.get('/id', async (req, res) => {
    try {
        const quiz = await myDB.getQuizById(req.params.id);
        if (quiz) {
            res.json(quiz);
        } else {
            res.status(404).json({ success: false, message: 'Quiz not found' });
        }
    } catch (error) {
        console.error('Error fetching quiz:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});


// Update a quiz
router.put('/id', async (req, res) => {
    try {
        const updatedCount = await myDB.updateQuiz(req.params.id, req.body);
        if (updatedCount > 0) {
            res.json({ success: true, message: 'Quiz updated' });
        } else {
            res.status(404).json({ success: false, message: 'Quiz not found' });
        }
    } catch (error) {
        console.error('Error updating quiz:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

// Delete a quiz
router.delete('/:id', async (req, res) => {
    try {
        const deletedCount = await myDB.deleteQuiz(req.params.id);
        if (deletedCount > 0) {
            res.json({ success: true, message: 'Quiz deleted' });
        } else {
            res.status(404).json({ success: false, message: 'Quiz not found' });
        }
    } catch (error) {
        console.error('Error deleting quiz:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

// router.post('/createquiz', async (req, res) => {
//     try {
//         const db = await connect();

//         const quiz = {
//             title: "Sample Quiz",
//             description: "A simple quiz example",
//             questions: [
//                 {
//                     type: "mcq",
//                     questionText: "What's the capital of France?",
//                     options: ["London", "Berlin", "Paris", "Rome"],
//                     correctAnswer: "Paris"
//                 },
//             ],
//             responses: []
//         };

//         const result = await db.collection('quiz').insertOne(quiz);

//         res.json({ success: true, quizId: result.insertedId });
//     } catch (error) {
//         console.error("Error inserting quiz:", error);
//         res.status(500).json({ success: false, message: "Internal server error" });
//     }
// });

export default router;