import React from 'react';
import axios from 'axios';

export default function NewAnswerPage({handleSetPage,q}) {
    return (
        <div className='newAnsPage'>
            <div className='newAnswer'>Username*</div>
            <br />
            <input className='smalltextbox' type="text" id="a-user-text" />

            <br />
            <br />
            <div className='newAnswer'>Answer Text*</div>
            <input className="largetextbox" type="text" id="a-ans-text" />
            <br />
            <br />
            <div>
                <button className='ans_post' onClick={()=> {
                    newAnswer(q); 
                    handleSetPage("ans")
                }}>
                    post
                </button>
                <span className='rednote'>* indicates mandatory fields</span>
            </div>
        </div>
    );
}


//check hyper link for the text
export function checkHyperlink(text, error) {

    //find if theres hyper link with pattern []()
    const pattern = /\[(.*?)\]\((.*?)\)/g;

    const matchedtext = pattern.exec(text);
    //console.log("match"+matchedtext[0])
    // const splitmatch=matchedtext.split(",");
    // console.log("match"+splitmatch)

    //if yes find the content inside
    if (matchedtext) {
       // for (const matchedOne in matchedtext) {
            const Lname = matchedtext[1];
            console.log("only name"+Lname);

            if (Lname.length === 0) {
                alert("hyperlink is empty");
                return false;
            }
            // const Lurl = nameNlink[1].slice(0, -1);
            const Lurl = matchedtext[2];
            //console.log(Lurl.length);

            //check if its start with http
            if (Lurl.length<7 ||(Lurl.slice(0,8)!=="https://" && Lurl.slice(0,7)!=="http://")) {
                alert("need to start with either https:// or http://");
                return false;
            }
       // }
    }
    return true;
}

async function newAnswer(q) {
    console.log("now at newAnswer()")
    const ansby = document.getElementById("a-user-text").value;
    const ans = document.getElementById("a-ans-text").value;

    if (!checkHyperlink(ans)) {
        alert("illigal hyperlink");
        return;
    }
    else {
        const newA = {
            text: ans,
            ans_by: ansby,
            ask_date_time: Date(),
            question:q._id
        }
        console.log("new obj")
        console.log(newA);

        await axios.post('http://localhost:8000/newAnswer', newA)
            .then(res => {
                console.log(res);
                console.log(res.data);
                if (res.data.slice(0, 6) === "Failed") {
                    alert(res.data);
                }else{
                    //get id and update question answers
                }
            }).catch((err) => {
                alert(err);
                console.error(err);
            });
    }
}