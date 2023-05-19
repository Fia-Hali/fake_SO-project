import React, { useState } from 'react';
import TagPage from '../components/tagsPage.js'
import QuestionMain from '../components/questionsPage'
import NewQuestionPage from '../components/newQuestionPage'
import NewAnswerPage from '../components/newAnswerPage'
import AnswerPage from '../components/answerPage'
import { handleLogout } from './fakestackoverflow.js'
import UserPage from './userProfile.js'

export default function HomePage({user, handleWelcome, handleUser}) {
    console.log(user);
    const [pageName, setPage] = useState('ques');
    const [text, setText] = useState('');
    const [isTag, setIsTag] = useState(false);
    const [question, setQ] = useState(null);
    const [tags,setTags] = useState([]);
  
    function checkSearch(e) {
        if (e.key === 'Enter') {
            handleText(e.target.value);
            console.log("Searching : " +e.target.value)
            handleSetPage('ques');
        }
    }
    
    function handleSetTags(tags){
        setTags(tags);
    }

    function handleSetPage(name) {
        setPage(name);
    }
    function handleText(input) {
        setText(input);
    }

    function handleIsTag(isTag){
        setIsTag(isTag);
    }

    function handleQ(q) {
        setQ(q);
    }

    return (
    <div>
        <div className="header" id="header" >
            <div >
                <a href="index.html"><b>Fake Stack Overflow</b></a>  
                <div className="search-bar">
                    <input 
                    type = "text" id ="search" placeholder = "Search..."
                    onKeyUp={((e)=>{checkSearch(e);})}
                    />
                </div>
            </div>
            <div className='block'>
                {user && <button onClick={()=>setPage("user")}> {user.name}</button>}
                {user &&  <button onClick={()=>{handleUser(null); handleWelcome("welcome"); handleLogout(handleWelcome);}}>Logout</button>}
            </div>
            <div className='block'>
                {!user && <button onClick={()=>handleWelcome("register")}>Sign up</button>}
                {!user && <button onClick={()=>handleWelcome("login")}>Login in</button>}
            </div>
                <label  className='left'>click the header will direct to welcome page~</label>
        </div>
        
        <div className="sidebar card" >
        <h1 className="bar-item ">   </h1>
        <button id="Questions" className="bar-item button hover-shadow" 
                onClick={()=> {handleSetPage('ques'); handleIsTag(false); handleText('')}} 
                >Questions</button>
        <h1 className="bar-item ">   </h1>
        <button id="Tags" className="bar-item button hover-shadow"
                onClick={()=> {handleSetPage('tags'); handleText(''); handleIsTag(false);}} 
                >Tags</button>

        </div> 
        {/* switch page click tags show questions of all tags */}
        
        {/* switch tags/ ques/ ans/ poQ/ poA pages */}
        <div>
        <SwitchPage  page={pageName} handleSetPage={handleSetPage} text={text} handleSetText = {handleText}  handleIsTag={handleIsTag} isTag={isTag} question={question} handleQ={handleQ} tags={tags} handleSetTags={handleSetTags} user={user}/>
        </div>
    </div>
    );
    }

export function SwitchPage({ page, handleSetPage, text, handleSetText, handleIsTag, isTag, handleQ, question ,tags, handleSetTags, user}) {

    switch (page) {
        case 'ques': return <QuestionMain text={text} user={user} handleSetPage={handleSetPage}  handleSetText={handleSetText} handleIsTag={handleIsTag} isTag={isTag} handleQ={handleQ} />;
        case 'poA':  return <NewAnswerPage handleSetPage={handleSetPage} user={user} q={question}/>;
        case 'poQ':  return <NewQuestionPage handleSetPage={handleSetPage} user={user} handleSetText = {handleSetText} handleSetTags={handleSetTags} />;
        case 'ans':  return <AnswerPage handleSetPage={handleSetPage} user={user} question={question} />;
        case 'tags': return <TagPage handleSetPage={handleSetPage} user={user} handleSetText={handleSetText} handleIsTag={handleIsTag}  tags={tags} handleSetTags={handleSetTags}/>;
        case 'user': return <UserPage handleSetPage={handleSetPage} user={user}/>;
        
        default: return;
    }
}