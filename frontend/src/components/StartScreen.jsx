import React from "react";

const StartScreen = ({ setScreen }) => {
  return (
    <div className="screen start">
      <h1>Welcome to the Quiz!</h1>
      <button onClick={() => setScreen("quiz")}>Start Quiz</button>
    </div>
  );
};

export default StartScreen;
