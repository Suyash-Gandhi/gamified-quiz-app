import React, { useState, useEffect } from "react";

export default function QuizScreen({ quizData, setScreen, setScore }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [points, setPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isMuted, setIsMuted] = useState(false); // Mute/unmute speech
  const [speechRate, setSpeechRate] = useState(1); // Default speech rate
  const [speechPitch, setSpeechPitch] = useState(1); // Default speech pitch
  const [voice, setVoice] = useState(null); // Selected voice
  const [voices, setVoices] = useState([]); // Available voices

  useEffect(() => {
    const fetchVoices = () => {
      const availableVoices = speechSynthesis.getVoices();
      setVoices(availableVoices);
      setVoice(availableVoices[0] || null);
    };

    speechSynthesis.onvoiceschanged = fetchVoices;
    fetchVoices();
  }, []);

  // Speech function
  const speak = (text) => {
    if (!isMuted && voice) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = speechRate;
      utterance.pitch = speechPitch;
      utterance.voice = voice;
      speechSynthesis.speak(utterance);
    }
  };

  if (!quizData.length) return <p>Loading quiz...</p>;

  const question = quizData[currentIndex];
  const correctIndex = question.options.findIndex((option) => option.is_correct);

  const handleAnswer = (index) => {
    setSelectedAnswer(index);
  };

  const nextQuestion = (timeUp = false) => {
    let updatedPoints = points;
    const isCorrect = selectedAnswer === correctIndex;

    if (!timeUp) {
      if (isCorrect) {
        speak("Correct! Well done.");
        setStreak((prevStreak) => prevStreak + 1);
        updatedPoints += 10;

        if (streak >= 2) {
          updatedPoints += 5;
          speak("Bonus points for streak!");
        }
      } else {
        speak("Incorrect! Try again.");
        setStreak(0);
      }
    } else {
      speak("Time is up!");
      setStreak(0);
    }

    if (currentIndex + 1 < quizData.length) {
      setPoints(updatedPoints);
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setTimeLeft(30);
    } else {
      setScore(updatedPoints);
      setScreen("result");
    }
  };

  useEffect(() => {
    if (timeLeft === 0) {
      nextQuestion(true);
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  return (
    <>
       {/* Progress Bar */}
       <div className="progress-bar">
          <div style={{ width: `${((currentIndex + 1) / quizData.length) * 100}%` }}></div>
        </div>
      <div className="screen quiz">
      <h2>Time Left: {timeLeft}s</h2>
       
        <h1>Question {currentIndex + 1}</h1>
        <div className="questions">
        <h2>{question.description}</h2>
        </div>

        <div className="options">
          {question.options.map((option, index) => (
            <button
              key={index}
              className={selectedAnswer === index ? "selected" : ""}
              onClick={() => handleAnswer(index)}
            >
              {option.description}
            </button>
          ))}
        </div>

        <button onClick={() => nextQuestion()} disabled={selectedAnswer === null}>
          Next
        </button>

        
      </div>

      <div className="speech-controls">
          <button onClick={() => setIsMuted(!isMuted)}>
            {isMuted ? "Unmute" : "Mute"} Speech
          </button>

          <label>
            Speech Rate:
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={speechRate}
              onChange={(e) => setSpeechRate(e.target.value)}
            />
          </label>

          <label>
            Speech Pitch:
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={speechPitch}
              onChange={(e) => setSpeechPitch(e.target.value)}
            />
          </label>

          <label>
            Voice:
            <select onChange={(e) => setVoice(voices.find((v) => v.name === e.target.value))}>
              {voices.map((v, index) => (
                <option key={index} value={v.name}>
                  {v.name}
                </option>
              ))}
            </select>
          </label>
        </div>
    </>
  );
}
