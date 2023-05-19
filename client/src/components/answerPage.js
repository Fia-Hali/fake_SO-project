import { useEffect, useState} from 'react';
import React from 'react';
import time from './utils/time';
import prevNnext from './utils/prevNnext';
import axios from 'axios';

export default function AnswerPage({ handleSetPage, question, user }) {
    console.log(user);
    // const [num, setnum]=useState(1);
    // function handlenum(n){
    //     setnum(num=>num+n);
    // }

    var num=0;


    console.log(question);
    // //getAnsByQid cuz update ans need new ansList
    useEffect(() => {
        getAns(question._id);
        getcomt(question._id);
        updateans(question._id);
    }, [])

    async function getAns(qid) {
        let ans = (await axios.get(`http://localhost:8000/question/active/${qid}`)).data;
        
        question.answers = ans;
        console.log(question);
    }//update the question when click the button

    async function getcomt(qid) {
        let comt = (await axios.get(`http://localhost:8000/question/comment/${qid}`)).data;
        question.comments = comt;
        console.log(question);
    }//update the question when click the button

    async function updateans(qid){
        let comt = (await axios.get(`http://localhost:8000/question/answer/comment/${qid}`)).data;
        question = comt;
        console.log(question);

    }

    console.log(question);

    const linkRegex = /\[(.+?)\]\((.+?)\)/;
    const parts = question.text.split(linkRegex);

    return (
        <div className="answer_page" id="answer_page">
            <div id="post_ans" className="question-main" >
                <table>
                    <tbody>
                        <tr className="home-page-bar " id="ansbar">

                            <td>
                                <label id="numA" >{question.answers.length} answers</label>
                            </td>
                            <td>
                                <label id="top_title" >{question.title}</label>
                            </td>
                            <td>
                                <button id="ask-question" className="ask-question" type="text"
                                    onClick={() => {
                                        if(user!==null) {handleSetPage('poQ'); }
                                        else(alert("Please log in to ask a new question"))}
                                    }
                                >Ask Question</button>
                            </td>

                        </tr>
                        <tr className="home-page-bar" id="ansinfo">

                            <td>
                                <label id="numV" >{question.views + 1} views</label>
                                <label id="numV" >{question.vote} votes</label>
                                <br/>
                                <button onClick={()=>handlevote(question._id,"question",1)}>up</button>
                                <button onClick={()=>handlevote(question._id,"question",0)}>down</button>
                            </td>
                            <td>
                                <label id="q-info" >  {parts.map((part, index) => {
                                    if (index % 3 === 0) {
                                        // This is a text part
                                        return <span key={index}>{part}</span>;
                                    } else if (index % 3 === 1) {
                                        // This is a link text part
                                        const url = question.text.match(linkRegex)[2];
                                        return (
                                            <a key={index} href={url}>
                                                {part}
                                            </a>
                                        );
                                    } else {
                                        // This is a link URL part
                                        return null;
                                    }
                                })}</label>
                            </td>
                            <td>
                                <label id="author" >
                                    <span id="askname" className='red'>{question.asked_by}
                                    </span>
                                    {" asked "}
                                    {time(new Date(question.ask_date_time))}
                                </label>
                                <br></br>
                                <div className='left'>{question.vote} {" votes"}</div>
                            </td>

                        </tr>

                        

                        {/* answer table */}

                    </tbody>
                </table>
                <div>Questoin Comments: </div>
                <ComtList AorQ={'question'} obj={question} user={user} num={num}/>
                <Anslistfunc question={question}/>
                <button id="answer-question" className="answer-question" type="text"
                                    onClick={() => {
                                    if(user!==null) {handleSetPage('poA'); }
                                    else(alert("Please log in to post a question"))}
                                }
                                >answer Question</button>
            </div>
        </div>

    );
}

function Anslistfunc({question}) {
    const [startIndex, setStartIndex] = useState(0);

    let anslist = [];


    if (question.answers.length !== 0) {
        question.answers.forEach(a => {
            anslist.push(ansblock(a));
        });
    }
    return (        <>
        <ul>
            {anslist.slice(startIndex, startIndex + 3).map((ans, index) => (
                <li key={index}>{ans}</li>
            ))}
        </ul>
        <div>
            <button onClick={()=>{prevNnext("prev",5,anslist.length, setStartIndex,startIndex)}} disabled={startIndex === 0}>
                Prev
            </button>
            <button onClick={()=>{prevNnext("next",5,anslist.length, setStartIndex,startIndex)}} disabled={startIndex + 5 >= anslist.length}>
                Next
            </button>
        </div>

    </>);
}

function ansblock(a,user, num) {
    const linkRegex = /\[(.+?)\]\((.+?)\)/;
    const parts = a.text.split(linkRegex);

    return (
        <tr key={a._id} className="table">
            <td className="anstexts" colSpan="2">
                {parts.map((part, index) => {
                    if (index % 3 === 0) {
                        // This is a text part
                        return <span key={index}>{part}</span>;
                    } else if (index % 3 === 1) {
                        // This is a link text part
                        const url = a.text.match(linkRegex)[2];
                        return (
                            <a key={index} href={url}>
                                {part}
                            </a>
                        );
                    } else {
                        // This is a link URL part
                        return null;
                    }
                })}
                <div>Ans Comments: </div>
                        <ComtList AorQ="answer" obj={a} user={user} num={num}/>

            </td>
            <td colSpan="2">
                <span className='blue'>{a.ans_by}</span>
                {" answered "}
                {time(new Date(a.ans_date_time))}
                <br/>
                {a.vote +" votes"}
                <button onClick={()=>handlevote(a._id,"answer",1)}>up</button>
                <button onClick={()=>handlevote(a._id,"answer",0)}>down</button>
            </td>
        </tr>
    );

}

function ComtList({AorQ, obj, user,num}) {
    const [startIndex, setStartIndex] = useState(0);

    let comtlist = [];

    //onj cound be question or answer
 
    if (obj.comments.length !== 0) {
        obj.comments.forEach(c => {
            comtlist.push(comtblock(c));
        });
    }

    const input = document.createElement('input');
    const uniqueId = `newComment${num}`; // Generate a unique ID
    //handlenum(1);
    num=num+1;

    input.type = 'text';
    input.id = uniqueId;
    input.placeholder='add new comment';
    return (
        // comtlist
        <>
            <ul>
                {comtlist.slice(startIndex, startIndex + 3).map((comment, index) => (
                    <li key={index}>{comment}</li>
                ))}
            </ul>

            {/* {input} */}
            <input type="text" id={uniqueId} name="new-comment" placeholder='add new comment'/>
            <button type="button" onClick={()=>{addComment(AorQ,obj,user)}}>enter</button>

            <div>
                <button onClick={()=>{prevNnext("prev",3,comtlist.length, setStartIndex,startIndex)}} disabled={startIndex === 0}>
                    Prev
                </button>
                <button onClick={()=>{prevNnext("next",3,comtlist.length, setStartIndex,startIndex)}} disabled={startIndex + 3 >= comtlist.length}>
                    Next
                </button>
            </div>

        </>
    )
}

function comtblock(c) {
    const linkRegex = /\[(.+?)\]\((.+?)\)/;
    console.log(c);

    const parts=c.text.split(linkRegex);
    return (
        
        <tr key={c._id} className="comttable">
            <td className="comttexts">
                {parts.map((part, index) => {
                    if (index % 3 === 0) {
                        // This is a text part
                        return <span key={index}>{part}</span>;
                    } else if (index % 3 === 1) {
                        // This is a link text part
                        const url = c.text.match(linkRegex)[2];
                        return (
                            <a key={index} href={url}>
                                {part}
                            </a>
                        );
                    } else {
                        // This is a link URL part
                        return null;
                    }
                })}
            </td>
            <td className='left'>
                <span className='textblue'>{c.comt_by}</span>
                {" commented "}
                {time(new Date(c.comt_date_time))}
                <br/>
                {c.vote +" votes"}
                <button onClick={()=>handlevote(c._id,"comment",1)}>up</button>
                
            </td>
        </tr>
    );

}

async function addComment(AorQ, obj, user,num){
    const text = document.getElementById("newComment"+num).value;


    const newC={
        text:text,
        comt_by:'aperson',
       // user.name,
        comt_by_user:'64629a2a735357d13425bd11',
        //user._id,
        obj:obj._id,
        AorQ:AorQ
    }
    await axios.post('http://localhost:8000/newComment', newC)
    .then(res => {
        console.log(res);
        console.log(res.data);
        if (res.data.slice(0, 6) === "Failed") {
            alert(res.data);
        }else{
            
        }
    }).catch((err) => {
        alert(err);
        console.error(err);
    });
}

function handlevote(obj, AorQorC,UporDown) {

    if(AorQorC==="question"){
         axios.get(`http://localhost:8000/quesIDVote/${UporDown}/${obj}`)
      .then(console.log("vote is updated; original q "))
    }
    if(AorQorC==="answer"){
        console.log(UporDown)
        axios.get(`http://localhost:8000/ansIDVote/${UporDown}/${obj}`)
     .then(console.log("vote is updated; original a"))
   }
   if(AorQorC==="comment"){
    axios.get(`http://localhost:8000/comtIDVote/${UporDown}/${obj}`)
 .then(console.log("vote is updated; original c"))
}
   
}