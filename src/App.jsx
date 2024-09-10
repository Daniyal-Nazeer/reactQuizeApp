import axios from "axios";
import React, { useRef, useState, useEffect } from "react";
import "./App.css"; // Make sure to import the CSS file

function App() {
  const [questions, setQuestions] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState({ correct: 0, incorrect: 0 });
  const checkedInput = useRef([]);

  useEffect(() => {
    axios("https://the-trivia-api.com/v2/questions")
      .then((res) => {
        setQuestions(res.data);
        setUserAnswers(new Array(res.data.length).fill(undefined));
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }

  function nextQuestion() {
    const checkedButton = checkedInput.current.find((input) => input.checked);
    if (checkedButton) {
      const selectedValue = checkedButton.value;
      const updatedAnswers = [...userAnswers];
      updatedAnswers[questionIndex] = selectedValue;
      setUserAnswers(updatedAnswers);
    }

    if (questionIndex < questions.length - 1) {
      setQuestionIndex((prevIndex) => prevIndex + 1);
      checkedInput.current = [];
    } else {
      displayResults();
    }
  }

  function displayResults() {
    const correctAnswers = questions.map((q) => q.correctAnswer);
    let correctCount = 0;

    userAnswers.forEach((answer, index) => {
      if (answer === correctAnswers[index]) {
        correctCount++;
      }
    });

    setResults({
      correct: correctCount,
      incorrect: questions.length - correctCount
    });
    setShowResults(true);
  }

  return (
    <div className="container">
      <h1>Quiz App</h1>
      {showResults ? (
        <div className="results">
          <h2>Quiz Results</h2>
          <p>Correct Answers: {results.correct}</p>
          <p>Incorrect Answers: {results.incorrect}</p>
          <p>Total Questions: {questions.length}</p>
        </div>
      ) : (
        <>
          {questions.length > 0 ? (
            <div>
              <h1 className="question">
                Q{questionIndex + 1}: {questions[questionIndex].question.text}
              </h1>

              <div className="container">
                <div id="quiz">
                  <ul className="choices">
                    {shuffleArray([
                      ...questions[questionIndex].incorrectAnswers,
                      questions[questionIndex].correctAnswer,
                    ]).map((item, index) => (
                      <li key={index} className="choice-item">
                        <input
                          type="radio"
                          name="choice"
                          id={`${questionIndex}-${index}`}
                          value={item}
                          ref={(el) => (checkedInput.current[index] = el)}
                        />
                        <label htmlFor={`${questionIndex}-${index}`}>{item}</label>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button onClick={nextQuestion}>
                {questionIndex < questions.length - 1 ? 'Next' : 'Finish'}
              </button>
            </div>
          ) : (
            <h1>Loading...</h1>
          )}
        </>
      )}
    </div>
  );
}

export default App;
