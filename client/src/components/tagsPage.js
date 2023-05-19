import React, { useEffect, useState} from 'react';
import axios from 'axios';

export default function TagPage({user, handleSetPage, handleSetText, handleIsTag}) {
    const[t, setT]=useState([]);

    useEffect(() => {
        axios.get('http://localhost:8000/tagunique')
        .then(res => setT(res.data))
        .catch(e=>console.log(e+": Can't get Tags"))
    }, []);

    const tagTable = () =>
    {   var eachRowtags=[];
        const rows=[];
        if(t.length===0){
            rows.push(<></>);
        }
        else{ t.forEach( tag=>{
            //single tag
            eachRowtags.push(<TagBlock key={tag.name} t={tag}  handleIsTag= {handleIsTag} handleSetPage={handleSetPage} handleSetText={handleSetText}></TagBlock>);
           
            if(eachRowtags.length===3){
                rows.push(
                    <div key={t+Math.random()} className='card_tag'>{eachRowtags}</div>
                );
                eachRowtags=[];
            }
        })
        //last row <=3
        if(eachRowtags.length!==0){
            rows.push(
            <div key={t+Math.random()} className='card_tag'>{eachRowtags}</div> );
        }
        console.log(rows);
        return rows;
    }}

    return (
        <div className="tag_page" id="tag_page">
            <div className="home-page-bar" id="tagbar">
                <label id="numT" >{t.length}    Tags</label>
                <label id="tag_page_title" >    All Tags</label>

                <button id="ask-question" className="ask-question" type="text" onClick={() => {
                                        if(user!==null) {handleSetPage('poQ'); }
                                        else(alert("Please log in to ask a new question"))}
                                    } >Ask Question</button>

            </div>
            <div className="m-questions tagtable" id="tagtable" >
                {tagTable()}
            </div>
        </div>
    );
}

function TagBlock({t, handleIsTag, handleSetPage, handleSetText}) {
    return (
        <div className='tag_block'>
            <div className='tag_item'>
                <p className='question-title'
                onClick={()=>{handleIsTag(true); handleSetPage('ques'); handleSetText("["+t.name+"]")}}>
                    {t.name}
                </p>
                <div className='tag_info'>
                    {t.count} 
                    question
                </div>
            </div>
        </div>
    );
}
