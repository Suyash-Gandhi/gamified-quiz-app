import React, { useState, useEffect } from "react";
import StartScreen from "./components/StartScreen";
import QuizScreen from "./components/QuizScreen";
import ResultScreen from "./components/ResultScreen";
import "./App.css";

// Fisher-Yates Shuffle Algorithm
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export default function App() {
  const [quizData, setQuizData] = useState([]);
  const [currentScreen, setCurrentScreen] = useState("start");
  const [score, setScore] = useState(0);

  // Function to fetch and shuffle quiz data
  const fetchQuizData = async () => {
    try {
      console.log("Fetching quiz data...");
      const response = await fetch("https://gamified-quiz-app-backend.onrender.com");
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      console.log("Quiz Data Fetched:", data);

      if (data.questions) {
        const shuffledQuestions = shuffleArray([...data.questions]); // Shuffle and update state
        setQuizData(shuffledQuestions);
      } else {
        console.error("Quiz data is not in the expected format");
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    }
  };

  // Fetch data initially when component mounts
  useEffect(() => {
    fetchQuizData();
  }, []);

  // Reset quiz when restarting
  const restartQuiz = () => {
    setScore(0);  // Reset score
    fetchQuizData(); // Fetch new shuffled questions
    setCurrentScreen("quiz"); // Start quiz again
  };

  return (
    <div className="app">
      {currentScreen === "start" && <StartScreen setScreen={setCurrentScreen} />}
      {currentScreen === "quiz" && (
        <QuizScreen quizData={quizData} setScreen={setCurrentScreen} setScore={setScore} />
      )}
      {currentScreen === "result" && <ResultScreen score={score} restartQuiz={restartQuiz} />}
    </div>
  );
}
