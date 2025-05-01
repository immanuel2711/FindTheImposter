import { useParams } from "react-router-dom";

export default function Game() {
  const { roomId } = useParams();
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Game Started!</h1>
      <p className="text-gray-600">Room ID: {roomId}</p>
      {/* Game logic will go here */}
    </div>
  );
}
