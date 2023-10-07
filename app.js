import express from 'express';

import myDB from './database/db.js';

// import { connect } from './database/db.js';
import quizRoutes from './routes/quizRoutes.js';


const app = express();
const PORT = 3000;

app.use(express.static('frontend'));
app.use(express.json()); 
app.use('/api/quizzes', quizRoutes);

const startServer = async () => {
    await myDB.connect();  // Ensure we're connected to MongoDB
    app.listen(PORT, () => {
      console.log(`Server started on http://localhost:${PORT}`);
    });
  };
  
startServer();



// // Connect to MongoDB when the server starts
// app.use((req, res, next) => {
//     res.status(404).json({ message: 'Not found' });
// });

// // Error Handling Middleware
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).json({ message: 'Internal Server Error' });
// });

// // Connecting to the database and then starting the server
// myDB.ensureConnection().then(() => {
//     app.listen(PORT, () => {
//         console.log(`Server started on http://localhost:${PORT}`);
//     });
// }).catch(error => {
//     console.error("Failed to connect to MongoDB:", error);
// });

// export default app;
