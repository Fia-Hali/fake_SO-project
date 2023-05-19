import { useState, useEffect } from 'react';
import React from 'react';
import axios from 'axios';

import TagPage from '../components/tagsPage.js'
import QuestionMain from '../components/questionsPage'
import NewQuestionPage from '../components/newQuestionPage'
import NewAnswerPage from '../components/newAnswerPage'
import AnswerPage from '../components/answerPage'
import { handleSetPage } from '../components/homepage.js'

// async function getUser(handleError,uid){
//     axios.get(`http://localhost:8000/user/${user}`)
//     .then(res=>{console.log("find user:"+ res.data); handleUser(res.data)})
//     .catch(error=> handleError(error));}



export default function UserPage({user,handleSetPage,handleSetText,handleIsTag,handleSetTags,text,handleQ}) {
    //need to print out each question title with links
    //maybe generate it in a seperate function



    const questions = user.questions
    return (
        <div className="newAnsPage">
            <div className="userPage-intro" >
                user page
                <br/>
                name: {user.name}
                <br/>

                time: {user.time}
                <br/>

                reputation: {user.reputation}
            </div>

            <div>
                {/* display list of users if they are admin
                and allow admin to delete user with delete button */}
                {/* {users} */}
                {/* <button>delete</button> */}
            </div>



            <div className="newAnsPage" >
            <ListOfQ user={user.questions}/>
            </div>
            {/* link to users tags page */}
            <button 
            onClick={()=>{<TagPage handleSetPage={handleSetPage} handleSetText={handleSetText} handleIsTag={handleIsTag}  tags={user.tags} handleSetTags={handleSetTags}></TagPage>}}
            >tags</button>
            {/* link to users answers */}
            <button onClick={()=>{<QuestionMain text={text} handleSetPage={handleSetPage}  handleSetText={handleSetText} handleIsTag={handleIsTag} isTag={false} handleQ={handleQ}></QuestionMain>}}>answers</button>
        </div>
    );
}

function ListOfQ({user}){
    // const qlist=user.questions.foreach((q)=><p onClick={() => { handleIsTag(false); handleSetPage('ans'); handleQ(q); updateView(q) }}>{q.title}</p>);
    //          
    // return(
    //     <ul>
    //         {qlist}
    //     </ul>

    // );
}

function Q({q}){
    // return(
    //     <div>
    //           <p onClick={() => { handleIsTag(false); handleSetPage('ans'); handleQ(q); updateView(q) }}>{q.title}</p>
    //         </div>
    // );
}