import React, { useEffect, useState } from "react";

const ResultScreen = ({ score, restartQuiz }) => {
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    const storedHighScore = localStorage.getItem("highScore");
    if (storedHighScore === null || score > storedHighScore) {
      localStorage.setItem("highScore", score);
      setHighScore(score);
    } else {
      setHighScore(storedHighScore);
    }
  }, [score]);

  return (
    <div className="screen result">
      <h1>Quiz Completed!</h1>
      <p>Your Score: {score}</p>
      <p>🏆 High Score: {highScore}</p>
      <button onClick={restartQuiz}>Restart Quiz</button>
    </div>
  );
};

export default ResultScreen;

