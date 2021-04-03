import React, { useState, useEffect } from "react";
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import { nanoid } from 'nanoid'
import "./App.css";

export default function App() {
  const [questions, setQuestions] = useState([]);



  const handleAnswerClick = (e, index, answer) => {
    let question = questions[index];
    if(!question.answered) {
      let newQuestions = questions;
      newQuestions[index].answered = true;
      newQuestions[index].isCorrect = question.correct_answer == answer;
      newQuestions[index].answerClicked = answer;
      setQuestions([...newQuestions]);
    }
  }





  useEffect(() => {
    fetch("https://opentdb.com/api.php?amount=10")
      .then((res) => res.json())
      .then((res) => {
        for(let i = 0; i < res.results.length; i++) {
          res.results[i].answered = false;
          let answers = [res.results[i].correct_answer, ...res.results[i].incorrect_answers];
          for(let j = 0; j < answers.length; j++) {
            const rand = Math.floor(Math.random() * answers.length);
            const temp = answers[j];
            answers[j] = answers[rand];
            answers[rand] = temp;
          }
          res.results[i].answers = answers;
        }
        
        setQuestions(res.results);
      });
  }, []);

  let answerList = [];
  for(let i = 0; i < questions.length; i++) {
    let answers = questions[i].answers;
    answerList.push(answers.map(answer => (
    <div className="answerWrapper">
      <Button key={nanoid()} variant="outlined" color="primary" className={questions[i].answered && answer == questions[i].correct_answer ? "correctAnswer" : questions[i].answered && questions[i].answerClicked == answer ? "incorrectAnswer" : "none"} onClick={(e) => handleAnswerClick(e, i, answer)}>{answer}</Button>
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
      {questionList}
    </div>
  );
}