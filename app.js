import express from "express";
import myDB from "./database/db.js";
import quizRoutes from "./routes/quizRoutes.js";
import responseRoutes from "./routes/responseRoutes.js";

const app = express();
const PORT = 3000;

app.use(express.static("frontend"));
app.use(express.json());
app.use("/api/quizzes", quizRoutes);
app.use("/api/responses", responseRoutes);

const startServer = async () => {
  await myDB.connect();
  app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
  });
};

startServer();
