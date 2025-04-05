// duel/duel.js

import { fetchQuestions } from "../utils/generateQuestions.js";

export function setupDuelNamespace(io) {
  const rooms = {}; // Structure: { roomId: { users: [], score: {}, questionCount: 0, questions: [], current: {} } }

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join-duel", async ({ userId, roomId }) => {
      socket.join(roomId);
      socket.userId = userId;
      socket.roomId = roomId;

      if (!rooms[roomId]) {
        try {
          const questions = await fetchQuestions();
          console.log("questions fetched")
          console.log(questions)
          rooms[roomId] = {
            users: [],
            score: {},
            questionCount: 0,
            questions,
            current: null
          };
        } catch (err) {
          console.error("Error fetching questions:", err);
          socket.emit("error", "Failed to fetch questions");
          return;
        }
      }

      rooms[roomId].users.push(socket);
      console.log(`${userId} joined room ${roomId}`);

      if (rooms[roomId].users.length === 2) {
        sendNewQuestion(roomId);
      }
    });

    socket.on("answer", ({ roomId, userId, answer }) => {
      const room = rooms[roomId];
      if (!room || !room.current) return;

      if (room.current.answers.find((a) => a.userId === userId)) return;

      room.current.answers.push({
        userId,
        answer,
        timestamp: Date.now()
      });

      if (room.current.answers.length === room.users.length) {
        evaluateAnswers(roomId);
      }
    });

    socket.on("disconnect", () => {
      const { roomId, userId } = socket;
      if (roomId && rooms[roomId]) {
        rooms[roomId].users = rooms[roomId].users.filter((s) => s.id !== socket.id);
        io.to(roomId).emit("opponent-left");
        if (rooms[roomId].users.length === 0) {
          delete rooms[roomId];
        }
      }
      console.log("User disconnected:", socket.id);
    });
  });

  function sendNewQuestion(roomId) {
    const room = rooms[roomId];
    if (!room || !room.questions) return;

    if (room.questionCount >= room.questions.length) {
      declareWinner(roomId);
      return;
    }

    const questionObj = room.questions[room.questionCount];

    room.current = {
      question: questionObj.Question,
      options: [
        questionObj.option1,
        questionObj.option2,
        questionObj.option3,
        questionObj.option4
      ],
      correct: questionObj.correctOptionNumber - 1,
      answers: [],
      startTime: Date.now(),
      timer: null
    };

    room.questionCount++;

    io.to(roomId).emit("new-question", {
      question: room.current.question,
      options: room.current.options,
      startTime: room.current.startTime,
      duration: 15
    });

    room.current.timer = setTimeout(() => {
      evaluateAnswers(roomId);
    }, 15000);
  }

  function evaluateAnswers(roomId) {
    const room = rooms[roomId];
    if (!room || !room.current) return;

    clearTimeout(room.current.timer);
    const correctIndex = room.current.correct;

    const results = room.current.answers.map((entry) => {
      const timeTaken = (entry.timestamp - room.current.startTime) / 1000;
      const correct = entry.answer === correctIndex;
      const points = correct ? Math.max(0, 15 - Math.floor(timeTaken)) : 0;

      if (!room.score[entry.userId]) room.score[entry.userId] = 0;
      room.score[entry.userId] += points;

      return {
        userId: entry.userId,
        correct,
        timeTaken,
        points
      };
    });

    io.to(roomId).emit("result", results);

    setTimeout(() => {
      sendNewQuestion(roomId);
    }, 3000);
  }

  function declareWinner(roomId) {
    const room = rooms[roomId];
    if (!room || !room.score) return;

    const finalScores = Object.entries(room.score).map(([userId, score]) => ({
      userId,
      score
    }));

    finalScores.sort((a, b) => b.score - a.score);
    const winner = finalScores[0];

    io.to(roomId).emit("final-result", {
      scores: finalScores,
      winner: winner.userId
    });

    delete rooms[roomId];
  }
}
