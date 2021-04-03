import React, { useState, useEffect } from "react";
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import { nanoid } from 'nanoid'
import "./App.css";

export default function App() {
  const [questions, setQuestions] = useState([]);
  useEffect(() => {
    fetch("https://opentdb.com/api.php?amount=10")
      .then((res) => res.json())
      .then((res) => {
        setQuestions(res.results);
      });
  }, []);

  let answerList = [];
  for(let i = 0; i < questions.length; i++) {
    let answers = [questions[i].correct_answer, ...questions[i].incorrect_answers];
    answerList.push(answers.map(answer => (
    <div className="answerWrapper">
      <Button variant="outlined" color="primary">{answer}</Button>
    </div>
    )));
  }

  let count = 0;
  const questionList = questions.map(question => {
    
    return (
      <Paper key={nanoid()} className="question" elevation={3}>
        <p className="qTitle">{question.question}</p>
        <div className="qAnswers">
          {answerList[count++]}
        </div>
      </Paper>
    )
  })
  return (
    <div>
      {questions.map((question) => (
        <h1>{questionList}</h1>
      ))}
    </div>
  );
}