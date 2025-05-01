import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

export default function Home() {
  const [playerName, setPlayerName] = useState("");
  const [joinRoomId, setJoinRoomId] = useState("");
  const navigate = useNavigate();

  const handleCreate = () => {
    if (!playerName.trim()) return alert("Please enter your name");
    const newRoomId = uuidv4().slice(0, 6);
    navigate(`/lobby/${newRoomId}?name=${encodeURIComponent(playerName)}`);
  };

  const handleJoin = () => {
    if (!playerName.trim()) return alert("Please enter your name");
    if (!joinRoomId.trim()) return alert("Please enter a Room ID");
    navigate(`/lobby/${joinRoomId}?name=${encodeURIComponent(playerName)}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-700 text-white">
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl w-[90%] max-w-md text-center">
        <h1 className="text-4xl font-bold mb-6">🕵️‍♂️ Imposter Clue Game</h1>
        <input
          type="text"
          placeholder="Enter your name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          className="w-full mb-4 px-4 py-2 rounded-xl text-black"
        />
        <button
          onClick={handleCreate}
          className="w-full bg-green-500 hover:bg-green-600 transition font-semibold py-2 px-4 rounded-xl mb-4"
        >
          🎮 Create Game
        </button>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Enter Room ID"
            value={joinRoomId}
            onChange={(e) => setJoinRoomId(e.target.value)}
            className="flex-1 px-4 py-2 rounded-xl text-black"
          />
          <button
            onClick={handleJoin}
            className="bg-blue-500 hover:bg-blue-600 transition px-4 rounded-xl"
          >
            Join
          </button>
        </div>
      </div>
    </div>
  );
}
