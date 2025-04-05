import { fetchQuestions } from "../utils/generateQuestions.js";

export function setupDuelNamespace(io) {
  // Structure: { roomId: { users: { userId: socket }, score: {}, questionCount: 0, questions: [], current: {} } }
  const rooms = {};

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join-duel", async ({ userId, roomId }) => {
      socket.join(roomId);
      socket.userId = userId;
      socket.roomId = roomId;

      // If a room exists but the game is finished, clear it so a new game starts.
      if (rooms[roomId] && rooms[roomId].questionCount >= rooms[roomId].questions.length) {
        delete rooms[roomId];
      }

      // Create room if it doesn't exist.
      if (!rooms[roomId]) {
        try {
          const questions = await fetchQuestions();
          console.log("Questions fetched for room", roomId);
          rooms[roomId] = {
            users: {},
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

      // Add or update the user in the room.
      rooms[roomId].users[userId] = socket;
      console.log(`${userId} joined room ${roomId}`);

      // If a game is already in progress, send the current question to the rejoining user.
      if (rooms[roomId].current) {
        socket.emit("new-question", {
          question: rooms[roomId].current.question,
          options: rooms[roomId].current.options,
          startTime: rooms[roomId].current.startTime,
          duration: 15
        });
      } else if (Object.keys(rooms[roomId].users).length === 2) {
        // Start the duel only when exactly two players are present.
        sendNewQuestion(roomId);
      }
    });

    socket.on("answer", ({ roomId, userId, answer }) => {
      const room = rooms[roomId];
      if (!room || !room.current) return;

      // Prevent duplicate answers from the same user.
      if (room.current.answers.find((a) => a.userId === userId)) return;

      room.current.answers.push({
        userId,
        answer,
        timestamp: Date.now()
      });

      // Evaluate when answers from all active users have been received.
      if (room.current.answers.length >= Object.keys(room.users).length) {
        evaluateAnswers(roomId);
      }
    });

    socket.on("disconnect", () => {
      const { roomId, userId } = socket;
      if (roomId && rooms[roomId]) {
        delete rooms[roomId].users[userId];
        io.to(roomId).emit("opponent-left", { userId });
        // Clean up room if empty.
        if (Object.keys(rooms[roomId].users).length === 0) {
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
      correct: questionObj.correctOptionNumber - 1, // zero-indexed
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
      // Only send a new question if at least two players remain.
      if (room && Object.keys(room.users).length >= 2) {
        sendNewQuestion(roomId);
      } else {
        room.current = null;
      }
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

    // Delete the room so that a new game will be started on rejoin.
    delete rooms[roomId];
  }
}
