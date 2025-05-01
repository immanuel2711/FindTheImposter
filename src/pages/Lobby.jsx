import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // Ensure this matches the backend server URL

export default function Lobby() {
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();
  const playerName = searchParams.get("name");
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    // Debugging: Log when joining the room
    console.log(`Joining room ${roomId} as ${playerName}`);

    // Emit event to the server to join the room
    socket.emit("joinRoom", roomId, playerName);

    // Listen for room updates (new players joining, etc.)
    socket.on("roomUpdate", (roomPlayers) => {
      console.log("Room players updated:", roomPlayers); // Debugging line
      setPlayers(roomPlayers);
    });

    return () => {
      socket.off("roomUpdate"); // Clean up the event listener on unmount
    };
  }, [roomId, playerName]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Lobby - Room ID: {roomId}</h1>
        <p className="text-gray-400">👤 You are: <strong>{playerName}</strong></p>

        <h2 className="mt-4 text-xl">Players in this room:</h2>
        <ul className="mt-4 text-gray-400">
          {players.map((player) => (
            <li key={player.id}>{player.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
