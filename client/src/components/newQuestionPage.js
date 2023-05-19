import React from 'react';
import axios from 'axios';


//new question page
export default function NewQuestionPage({ handleSetPage, handleSetTags, handleSetText}) {

    return (
        <div className="question-main" id="question-page">
            <div name="add_q" action="" method="get">
                <h1 className="q-title">Question Title*</h1>
                <h4 className="q-explain"> limit tittle to 100 characters or less</h4>
                <input className='smalltextbox' type="text" id="q-title-text" name="q-frame" />

                <br /><br />
                <h1 className="q-title">Question Text*</h1>
                <h4 className="q-explain"> add details</h4>
                <input className='largetextbox' type="text" id="q-text-text" name="q-frame" />

                <br /><br />
                <h1 className="q-title">Tags*</h1>
                <h4 className="q-explain"> add keywords separated by whitespace</h4>
                <input className='smalltextbox' type="text" id="q-tags-text" name="q-frame" />

                <br /><br />
                <h1 className="q-title">Username*</h1>
                <input className='smalltextbox' type="text" id="q-username-text" name="q-frame" />

                <br /><br />
                <button id="submit_q" onClick={()=>{newQuestion();  handleSetPage('ques'); handleSetTags(""); handleSetText(""); }}>
                    <div>submit</div>
                </button>
            </div>
        </div>
    );
}

//check hyper link for the text
export function checkHyperlink(text, error) {
    const pattern = /\[(.*?)\]\((.*?)\)/g;

    const matchedtext = pattern.exec(text);
    if (matchedtext) {
        const Lname = matchedtext[1];

        if (Lname.length === 0) {
            alert("hyperlink is empty");
            return false;
        }
        const Lurl = matchedtext[2];

        //check if its start with http
        if (Lurl.length < 7 || (Lurl.slice(0, 8) !== "https://" && Lurl.slice(0, 7) !== "http://")) {
            alert("need to start with either https:// or http://");
            return false;
        }
    }
    return true;
}

//create new tags for the new question
function newTags() {
    console.log("now at newtag()")

    //get tag information from imput
    const tags = document.getElementById("q-tags-text").value;
    const aftersplit = tags.split(" ");
    if (aftersplit.length > 5) {
        alert("too many tags");
    } else {
        var boo = true
        for (let i = 0; i < aftersplit.length; i++) {
            if (aftersplit[i].length > 10) {
                boo = false;
            }
        }
        console.log(boo);
        if (boo) {
            const tagIDLIst = [];
            //aftersplit.forEach(t => { tagIDLIst.push(createTag(t)); });
        }
    }



    return aftersplit;
}



async function newQuestion() {

    const title = document.getElementById("q-title-text").value;
    const text = document.getElementById("q-text-text").value;
    const user = document.getElementById("q-username-text").value;

    if (!checkHyperlink(text)) {
        alert("illigal hyperlink");
        return;
    }
    else {
        console.log("now at newquestion()")

        console.log("going to newtag()")
        const listoftag = newTags();
        if (listoftag.length > 5) {
            return;
        }

        console.log("here");

        console.log(listoftag);
        console.log(listoftag[0]);
        const newQ = {
            title: title,
            text: text,
            tags: listoftag,
            asked_by: user,
            ask_date_time: Date(),
        }
        console.log("new obj")
        console.log(newQ);

        await axios.post('http://localhost:8000/newQuestion', newQ)
            .then(res => {
                console.log(res);
                console.log(res.data);
                if (res.data.slice(0, 6) === "Failed") {
                    alert(res.data);
                }
            }).catch((err) => {
                alert(err);
                console.error(err);
            });
    }
}