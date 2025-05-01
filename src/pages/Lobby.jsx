import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

export default function Lobby() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [playerName, setPlayerName] = useState(""); // get from URL or state
  const [isHost, setIsHost] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const name = queryParams.get("name");
    setPlayerName(name);

    socket.emit("joinRoom", roomId, name);

    socket.on("roomUpdate", (playerList) => {
      setPlayers(playerList);

      // First player in the list is host
      if (playerList.length > 0 && playerList[0].name === name) {
        setIsHost(true);
      } else {
        setIsHost(false);
      }
    });

    socket.on("gameStarted", () => {
      navigate(`/game/${roomId}`);
    });

    return () => {
      socket.off("roomUpdate");
      socket.off("gameStarted");
    };
  }, [roomId]);

  const startGame = () => {
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
