import { useState, useEffect } from 'react';
import React from 'react';
import time from './utils/time';
import prevNnext from './utils/prevNnext';
import axios from 'axios';


export default function QuestionsPage({ text,user, handleSetPage, isTag, handleIsTag, handleSetText, handleQ }) {
  const [questions, setQuestions] = useState([]);
  const [tab, setTab] = useState("Newest");
  const [sortedList, setList] = useState([]);

  // Empty list as 2nd argument ensures that the effect
  // is called only once and not after every render
  useEffect(() => {
    console.log("im here once again")
    //search
    if (text.length !== 0) {
      let url = `http://localhost:8000/search/${text}`;
      axios.get(url)
        .then(res => {
          console.log("Search for : " + text + "and " + res.data);
          updateTagAns(res.data);
        }).catch(e => "search " + e)
    }
    else {
      axios.get('http://localhost:8000/question')
        .then(res => {
          console.log("page is generating....")
          updateTagAns(res.data);
        }).catch(e => console.log("question " + e));
    }
  }, [text]);

  async function updateTagAns(ques) {
    for (let q of ques) {
      //tag names
      const tagsName = (await axios.get(`http://localhost:8000/question/tagsName/${q._id}`)).data;
      q.tags = tagsName;
      //answers
      let newestAnsDate = (await axios.get(`http://localhost:8000/question/active/${q._id}`)).data;
      q.answers = newestAnsDate;
      //comment
      let newComt = (await axios.get(`http://localhost:8000/question/comment/${q._id}`)).data;
      q.comments = newComt;
      //answer+comment
      let comt = (await axios.get(`http://localhost:8000/question/answer/comment/${q._id}`)).data;
      q = comt;
    }
    console.log(ques);
    setQuestions(ques);
    setList(ques);
  }

  //search text => plz all lower case
  const searchLength = questions.length;
  const Displayedtext = isTag ? ("Tag " + text) : ((text === '') ? "All Questions" : (searchLength === 0 ? "No Questions Found" : "Searched Result"));

  function handleTab(tab) {
    tabColor(tab);
    setTab(tab);
    switch (tab) {
      case "Newest":
        setList(questions.sort(function (a, b) {
          //ask_date_time => type is string
          //console.log(typeof  b.ask_date_time +  b.ask_date_time);
          return new Date(b.ask_date_time) - new Date(a.ask_date_time);
        }));
        break;
      case "Active":
        for (let q of questions) {
          const ans = q.answers.sort((a, b) => new Date(b.ans_date_time) - new Date(a.ans_date_time));
          q.answers = ans;
        }
        setList(questions.sort((a, b) => {
          if(a.answers.length===0) return -1;
          if(b.answers.length===0) return -1;
          else return new Date(b.answers[0].ans_date_time) - new Date(a.answers[0].ans_date_time)
        }));
        break;
      case "Unanswered":
        setList(questions.filter(q => q.answers.length === 0));
        break;
      default:
        handleTab("Newest");
    }
  }

  return (
    <div className="homepage" id="main">
      <div className="home-page-bar" id="mainbar">
        <label className='question-main-title'><b>{Displayedtext}</b></label>
        <button id="ask-question" className="ask-question" type="text"
          onClick={() =>  {
            if(user!==null) {handleSetPage('poQ'); handleIsTag(false); }
            else(alert("Please log in to ask a new question"))
            }}>Ask Question</button>
      </div>

      <div className="home-page-bar" >
        <label id="numq" >{searchLength} Questions</label>
        <div className="tab flex-right">
          <button id="Newest" className='khaki' onClick={() => { handleTab("Newest") }} >Newest</button>
          <button id="Active" onClick={() => { handleTab("Active"); }} >Active</button>
          <button id="Unanswered" onClick={() => { handleTab("Unanswered"); }}  >Unanswered</button>
        </div>
        <br />
        <br />
        <div>
          {(searchLength === 0 ? " " : <QuestionTable qlst={sortedList} handleSetPage={handleSetPage} handleIsTag={handleIsTag} handleSetText={handleSetText} handleQ={handleQ} tab={tab} />)}
        </div>
      </div>
    </div>
  );
}

function QuestionTable({ qlst, handleSetPage, handleIsTag, handleSetText, handleQ, tab }) {

  const [startIndex, setStartIndex] = useState(0);

  const rows = [];
  let counter = 0;
  tabColor(tab);
  qlst.forEach(element => rows.push(<Row key={element + (counter++)} q={element} handleSetPage={handleSetPage} handleIsTag={handleIsTag} handleSetText={handleSetText} handleQ={handleQ} />));

  return (<>
    <ul>
      {rows.slice(startIndex, startIndex + 5).map((question, index) => (
        <li key={index}>{question}</li>
      ))}
    </ul>
    <div>
      <button onClick={()=>{prevNnext("prev",5,rows.length, setStartIndex,startIndex)}} disabled={startIndex === 0}>
        Prev
      </button>
      <button onClick={()=>{prevNnext("next",5,rows.length, setStartIndex,startIndex)}} disabled={startIndex + 5 >= rows.length}>
        Next
      </button>
    </div>

    {/* {rows} */}
  </>);
}

function Row({ q, handleSetPage, handleIsTag, handleSetText, handleQ }) {
  const tagNames = q.tags.map((e) => {
    return <Tag key={e} tag={e} handleIsTag={handleIsTag} handleSetPage={handleSetPage} handleSetText={handleSetText} />;
  });

  //updateView
  function updateView(ques) {
    axios.get(`http://localhost:8000/quesIDView/${ques._id}`)
      .then(console.log("view is updated; original " + ques.views))
  }

  return (
    <table className="table">
      <tbody>
        <tr key={q._id} className="question-blocks ">
          <td className='left-lable'>
            <div>
              {q.answers.length} {" answers"}
              <br />
              {q.views} {" views"}
              <br/>
              {q.vote} {" votes"}
            </div>
          </td >
          <td className="td3">
            <div className='question-title'>
              {/* need a onclick here, showAnswerPage, set view!! */}
              <p onClick={() => { handleIsTag(false); handleSetPage('ans'); handleQ(q); updateView(q) }}>{q.title}</p>
            </div>
            {tagNames}
          </td>

          <td className="td4">
            <div className='question_post_time'>
              <span className='red'>
                {q.asked_by}
              </span>
              {"  asked "}
              {time(new Date(q.ask_date_time))}
            </div>
            <br></br>
            <div >{q.vote} {" votes"}</div>
          </td>
        </tr>
      </tbody>
    </table>);
}

function Tag({ tag, handleIsTag, handleSetPage, handleSetText }) {
  return (
    <button className='tag_btn' onClick={() => { handleIsTag(true); handleSetPage('ques'); handleSetText("[" + tag + "]") }}> {tag} </button>
  );
}

function tabColor(name) {
  document.getElementById("Newest").style = "";
  document.getElementById("Active").style = "";
  document.getElementById("Unanswered").style = "";
  document.getElementById(name).style = "background-color: khaki;"
}
  //hyperlink display name and click
