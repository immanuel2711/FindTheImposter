import { useLocation } from "react-router-dom";

export default function Game() {
  const location = useLocation();
  const { role, clue, secretWord } = location.state || {};

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Your Role: {role}</h2>
      {role === "Imposter" ? (
        <p>Your First clue: {clue}</p>
      ) : (
        <p>The secret word is: {secretWord}</p>
      )}
    </div>
  );
}
