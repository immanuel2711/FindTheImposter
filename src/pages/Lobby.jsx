import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import io from "socket.io-client";

// Connect to the server
const socket = io("http://localhost:5000");

export default function Lobby() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [playerName, setPlayerName] = useState("");
  const [isHost, setIsHost] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const name = queryParams.get("name");

    if (!name) {
      console.error("No player name found in URL");
      return;
    }

    setPlayerName(name);

    socket.emit("joinRoom", roomId, name);

    socket.on("roomUpdate", (playerList) => {
      setPlayers(playerList);
      if (playerList.length > 0 && playerList[0].name === name) {
        setIsHost(true);
      } else {
        setIsHost(false);
      }
    });

    socket.on("gameStarted", (rolesAndClues, secretWord) => {
      console.log("Game started, navigating to game page...");

      if (Array.isArray(rolesAndClues) && rolesAndClues.length > 0) {
        const player = rolesAndClues.find(
          (p) => p.name.toLowerCase() === name.toLowerCase()
        );

        if (player) {
          navigate(`/game/${roomId}`, {
            state: {
              role: player.role,
              clue: player.clue,
              secretWord: secretWord,
            },
          });
        } else {
          console.error("Player not found in rolesAndClues");
        }
      } else {
        console.error("rolesAndClues is not a valid array or is empty.");
      }
    });

    return () => {
      socket.off("roomUpdate");
      socket.off("gameStarted");
    };
  }, [roomId, navigate]);

  const startGame = () => {
    console.log("Start Game button clicked");
    socket.emit("startGame", roomId);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Room: {roomId}</h2>
      <ul className="my-4">
        {players.map((player) => (
          <li key={player.id}>{player.name}</li>
        ))}
      </ul>
      {isHost && (
        <button
          onClick={startGame}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Start Game
        </button>
      )}
    </div>
  );
}
