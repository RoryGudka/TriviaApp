import React, { useState} from "react";
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import { nanoid } from 'nanoid'
import "./App.css";

export default function App() {
  const [questions, setQuestions] = useState([]);
  const [lastSearch, setLastSearch] = useState({});
  const [subject, setSubject] = useState(8);
  const [numQuestions, setNumQuestions] = useState(10);
  
  

  const handleChange = val => {
    setSubject(val.target.value);
  }
  const handleNumChange = val => {
    setNumQuestions(val.target.value);
  }
  const handleSearch = e => {
    let num = parseInt(numQuestions);
    if(typeof num == "number" ) {
      if(num < 1) num = 1;
      else if(num > 100) num = 100;
      setLastSearch({
        "subject":subject,
        "numQuestions":num
      })
      search(subject ===8 ? `https://opentdb.com/api.php?amount=${num}` : `https://opentdb.com/api.php?amount=${num}&category=${subject}`);
    }
  }
  const search = url => {
    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        for(let i = 0; i < res.results.length; i++) {
          let question = res.results[i];
          question.question = decodeHTML(question.question);
          question.answered = false;
          question.correct_answer = decodeHTML(question.correct_answer);
          for(let j = 0; j < question.incorrect_answers.length; j++) {
            question.incorrect_answers[j] = decodeHTML(question.incorrect_answers[j]);
          }
          let answers = [question.correct_answer, ...question.incorrect_answers];
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
  }
  const handleMore = e => {
    searchMore(lastSearch.subject === 8 ? `https://opentdb.com/api.php?amount=${lastSearch.numQuestions}` : `https://opentdb.com/api.php?amount=${lastSearch.numQuestions}&category=${lastSearch.subject}`);
  }
  const searchMore = url => {
    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        for(let i = 0; i < res.results.length; i++) {
          let question = res.results[i];
          question.question = decodeHTML(question.question);
          question.answered = false;
          question.correct_answer = decodeHTML(question.correct_answer);
          for(let j = 0; j < question.incorrect_answers.length; j++) {
            question.incorrect_answers[j] = decodeHTML(question.incorrect_answers[j]);
          }
          let answers = [question.correct_answer, ...question.incorrect_answers];
          for(let j = 0; j < answers.length; j++) {
            const rand = Math.floor(Math.random() * answers.length);
            const temp = answers[j];
            answers[j] = answers[rand];
            answers[rand] = temp;
          }
          res.results[i].answers = answers;
        }
        setQuestions([...questions, ...res.results]);
      });
  }
  const  decodeHTML = html => {
    var txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };
  const handleAnswerClick = (e, index, answer) => {
    let question = questions[index];
    if(!question.answered) {
      let newQuestions = questions;
      newQuestions[index].answered = true;
      newQuestions[index].isCorrect = question.correct_answer === answer;
      newQuestions[index].answerClicked = answer;
      setQuestions([...newQuestions]);
    }
  }



  let answerList = [];
  let numCorrect = 0;
  let numTried = 0;
  for(let i = 0; i < questions.length; i++) {
    if(questions[i].answered) {
      numTried++;
      if(questions[i].isCorrect) numCorrect++;
    }
    let answers = questions[i].answers;
    answerList.push(answers.map(answer => (
    <div key={nanoid()} className="answerWrapper">
      <Button variant="outlined" color="primary" className={questions[i].answered && answer === questions[i].correct_answer ? "correctAnswer" : questions[i].answered && questions[i].answerClicked === answer ? "incorrectAnswer" : "none"} onClick={(e) => handleAnswerClick(e, i, answer)}>{answer}</Button>
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


  console.log(numTried);
  return (
    <div>
      <div id="searchContainer">
        <FormControl>
          <InputLabel>Category</InputLabel>
          <Select id="demo-simple-select" value={subject} onChange={handleChange}>
            <MenuItem value={8}>Any Category</MenuItem>
            <MenuItem value={9}>General Knowledge</MenuItem>
            <MenuItem value={10}>Entertainment: Books</MenuItem>
            <MenuItem value={11}>Entertainment: Film</MenuItem>
            <MenuItem value={12}>Entertainment: Music</MenuItem>
            <MenuItem value={13}>Entertainment: Musicals & Theaters</MenuItem>
            <MenuItem value={14}>Entertainment: Television</MenuItem>
            <MenuItem value={15}>Entertainment: Video Games</MenuItem>
            <MenuItem value={16}>Entertainment: Board Games</MenuItem>
            <MenuItem value={17}>Science & Nature</MenuItem>
            <MenuItem value={18}>Science: Computers</MenuItem>
            <MenuItem value={19}>Science: Mathematics</MenuItem>
            <MenuItem value={20}>Mythology</MenuItem>
            <MenuItem value={21}>Sports</MenuItem>
            <MenuItem value={22}>Geography</MenuItem>
            <MenuItem value={23}>History</MenuItem>
            <MenuItem value={24}>Politics</MenuItem>
            <MenuItem value={25}>Art</MenuItem>
            <MenuItem value={26}>Celebrities</MenuItem>
            <MenuItem value={27}>Animals</MenuItem>
            <MenuItem value={28}>Vehicles</MenuItem>
            <MenuItem value={29}>Entertainment: Comics</MenuItem>
            <MenuItem value={30}>Science: Gadgets</MenuItem>
            <MenuItem value={31}>Entertainment: Japanese Anime & Manga</MenuItem>
            <MenuItem value={32}>Entertainment: Catoons and Animation</MenuItem>
          </Select>
        </FormControl>
        <div id="numWrapper">
          <TextField fullWidth label="Amount" className="specific" value={numQuestions} onChange={handleNumChange}></TextField>
        </div>
        <Button id="searchBtn" variant="contained" color="primary" onClick={handleSearch}>Search</Button>
      </div>
      {questionList.length !== 0 ? questionList : <p id="noQuestions">Make a search to get questions</p>}
      {questionList.length !== 0 && numTried === questionList.length ? <div id="moreWrapper"><Button variant="contained" color="primary" onClick={handleMore}>Show More Questions</Button></div> : ""}
    </div>
  );
}