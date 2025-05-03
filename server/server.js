const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // Allow React app on port 3000
    methods: ["GET", "POST"], // Allow GET and POST methods
  },
});

let rooms = {}; // To store active rooms

app.use(cors()); // Enable CORS

app.get("/", (req, res) => {
  res.send("Server is running...");
});

// Handle new player connection
io.on("connection", (socket) => {
  console.log("A user connected");

  // When a user joins a room
  socket.on("joinRoom", (roomId, playerName) => {
    if (!rooms[roomId]) rooms[roomId] = [];

    // Check if the player is already in the room
    const playerExists = rooms[roomId].some((player) => player.id === socket.id);

    if (!playerExists) {
      // Add player to room if not already present
      rooms[roomId].push({ id: socket.id, name: playerName });

      // Join the room
      socket.join(roomId);

      // Notify all players in the room
      io.to(roomId).emit("roomUpdate", rooms[roomId]);

      console.log(`${playerName} joined room ${roomId}`);
    }
  });

  // Start the game
  socket.on("startGame", (roomId) => {
    console.log(`Game starting in room: ${roomId}`);

    // Generate random roles and clues
    const rolesAndClues = rooms[roomId].map((player, index) => {
      let role = "";
      let clue = "";

      if (index === 0) {
        role = "Imposter"; // First player is the Imposter
        clue = "It can walk"; // Imposter's vague clue
      } else {
        role = "Clue Giver"; // Rest are Clue Givers
        clue = "It has a trunk"; // Clue Givers' clues
      }

      return { id: player.id, name: player.name, role: role, clue: clue };
    });

    const secretWord = "elephant"; // Sample word

    console.log("Roles and clues generated for players:", rolesAndClues);

    // Emit the roles, clues, and secretWord to all players
    io.to(roomId).emit("gameStarted", rolesAndClues, secretWord);
  });

  // When a user disconnects
  socket.on("disconnect", () => {
    for (let roomId in rooms) {
      const room = rooms[roomId];
      const playerIndex = room.findIndex((player) => player.id === socket.id);
      if (playerIndex !== -1) {
        // Remove player from room
        rooms[roomId].splice(playerIndex, 1);
        io.to(roomId).emit("roomUpdate", rooms[roomId]);
        console.log("User disconnected and removed from room");
      }
    }
  });
});

// Start the server
server.listen(5000, () => {
  console.log("Server is running on http://localhost:5000");
});
