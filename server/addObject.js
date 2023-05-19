let Answers = require('./models/answers');
let Questions = require('./models/questions');
let Tags = require('./models/tags');
let Comments = require('./models/comments');
let Users = require('./models/users');


//saw factory pattern method on google, try this out
//adjust if not working
// const obj = { Answers, Questions, Tags, Comments, Users };
// module.exports = {
//     createObj(type, attributes) {
//         const ObjType = obj[type];
//         return new ObjType(attributes);
//     }
// };



// exports.newObj = async (res, name, attributes) => {

//     try {
//         const newThing=createObj(name,attributes);
//         await newThing.save().
//             then(function (result) {
//                 //   res.json(result)
//                 res.send('Created new ' +name+ ': ' + result);
//             })
//             .catch(function (err) {
//                 res.send('Failed to save ' +name+ ' : ' + err);
//                 return;
//             });
//     }
//     catch (err) {
//         res.send('Failed to create new ' +name+ ' : ' + err);
//     }
// }


// let Answers = require('./models/answers');
// let Questions = require('./models/questions');
// let Tags = require('./models/tags');



async function newtag(tags) {
    for (let i = 0; i < tags.length; i++) {
        const tag = Tags({
            name: tags[i]
        });
        await tag.save().
            then(function (result) {
                console.log("new tag created" + tag);

            })
    }
}

function getTags(tag) {

    const lst = Tags.find({ name: { $in: tag } });
    console.log("found" + lst);

    return lst;
}
exports.newQuestion = async (res, title, text, tags) => {
    console.log("async new q")
    console.log("this is tags" + tags)
    const listoftagid = [...new Set(tags)];
    try {
        await newtag(tags);

        let tagids = await getTags(listoftagid).exec();
        console.log("tag ids" + tagids);

        const uniqueTags = tagids.filter((tag, index, self) => index === self.findIndex((t) => t.name === tag.name));

        const question = Questions({
            title: title,
            text: text,
            tags: uniqueTags
        });
        await question.save().
            then(function (result) {

                res.send('Created new question : ' + result);
            })
            .catch(function (err) {
                res.send(err);
                return;
            });
    }
    catch (err) {
        res.send('Failed ' + err);

    }
}


async function getQues(question, newA, AorC) {

    Questions.findOne({ _id: question }).
        then(q => {
            if (AorC === "answer") {
                q.answers.push(newA);
                console.log(q);

                return q.save();
            }
            if (AorC === "comment") {
                q.comments.push(newA);
                console.log(q);

                return q.save();
            }


        })
}
async function getAns(answer, newC) {

    Answers.findOne({ _id: answer }).
        then(a => {
            a.comments.push(newC);
            console.log(a);

            return a.save();

        })
}

async function getUser(user, newC, QorAorC) {

    Users.findOne({ _id: user }).
        then(u => {
            if (QorAorC === "comment") {
                u.comments.push(newC);
                console.log(u);

                return u.save();
            }
            if (QorAorC === "answer") {
                u.answers.push(newC);
                console.log(u);

                return u.save();
            }
            if (QorAorC === "question") {
                u.questions.push(newC);
                console.log(u);

                return u.save();
            }


        })
}

exports.newAnswer = async (res, text, ans_by, question) => {
    try {
        console.log(question);

        const answer = Answers({
            text: text,
            ans_by: ans_by
        });
        await answer.save().
            then(function (result) {
                console.log("new answer created" + answer);
                getQues(question, answer, "answer");
            }).catch(function (err) {
                res.send('Failed to save answer : ' + err);
                return;
            });

    }
    catch (err) {
        res.send('Failed to create new answer : ' + err);
        res.redirect("/question")
    }
}


exports.newComment = async (res, text, comt_by, comt_by_user, obj, AorQ) => {
    try {
        // console.log(question);

        const comment = Comments({
            text: text,
            comt_by: comt_by,
            comt_by_user: comt_by_user
        });
        await comment.save().
            then(function (result) {
                console.log("new comment created" + comment);
                if (AorQ === "question") {
                    getQues(obj, comment, "comment");
                }
                if (AorQ === "answer") {
                    console.log("at add comment to answer");
                    getAns(obj, comment);
                }
                getUser(comt_by_user, comment);

            }).catch(function (err) {
                res.send('Failed to save comment : ' + err);
                return;
            });

    }
    catch (err) {
        res.send('Failed to create new comment : ' + err);
        res.redirect("/question")
    }
}

