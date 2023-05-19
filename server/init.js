//Setup database with initial test data.
// Include an admin user.
// Script should take admin credentials as arguments as described in the requirements doc.

// Run this script to test your schema
// Start the mongoDB service as a background process before running the script
// Pass URL of your mongoDB instance as first argument(e.g., mongodb://127.0.0.1:27017/fake_so)
let userArgs = process.argv.slice(2);

if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}

let Tag = require('./models/tags')
let Answer = require('./models/answers')
let Question = require('./models/questions')
let Comments = require('./models/comments');
let Users = require('./models/users');


let mongoose = require('mongoose');
let mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
// mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

let tags = [];
let answers = [];
function tagCreate(name) {
    let tag = new Tag({ name: name });
    return tag.save();
}

function answerCreate(text, comments, ans_by, ans_by_user, ans_date_time) {
    answerdetail = { 
        text: text,
        ans_by_user:ans_by_user
    };
    if (ans_by != false) answerdetail.ans_by = ans_by;
    if (ans_date_time != false) answerdetail.ans_date_time = ans_date_time;
    if (comments != false) answerdetail.comments = comments;
    let answer = new Answer(answerdetail);
    return answer.save();
}

function questionCreate(title, text, tags, answers, comments, asked_by,ask_by_user, ask_date_time, views) {
    qstndetail = {
        title: title,
        text: text,
        tags: tags,
        asked_by: asked_by,
        ask_by_user:ask_by_user
    }
    if (answers != false) qstndetail.answers = answers;
    if (ask_date_time != false) qstndetail.ask_date_time = ask_date_time;
    if (views != false) qstndetail.views = views;
    if (comments != false) qstndetail.comments = comments;

    let qstn = new Question(qstndetail);
    return qstn.save();
}

function commentCreate(text, comt_by, comt_by_user, comt_date_time) {
    comtdetail = {
        text: text,
        comt_by: comt_by,
        comt_by_user:comt_by_user
    }
    if (comt_date_time != false) comtdetail.comt_date_time = comt_date_time;

    let comt = new Comments(comtdetail);
    return comt.save();

}

function userCreate(admin, name, email,password,reputation, time, tags, answers,questions,comments){
    userdetail={
        name:name,
        email:email,
        password:password
    }
    if (admin != false) userdetail.admin = admin;
    if (reputation != false) userdetail.reputation = reputation;
    if (time != false) userdetail.time = time;
    if (tags != false) userdetail.tags = tags;
    if (answers != false) userdetail.answers = answers;
    if (questions != false) userdetail.questions = questions;
    if (comments != false) userdetail.comments = comments;
    
    let user = new Users(userdetail);
    return user.save();


}

function updateUser(user,tags, answers,questions,comments){ 
    user.tags=tags;
    user.answers=answers;
    user.questions=questions;
    user.comments=comments;

    return user.save();

}

const populate = async () => {

    let u1 =await userCreate(true, "fia", 'hali.gulifeiya@stonybrook.edu','nosuchthing',500,false,false,false,false,false );
    let u2 =await userCreate(false, "aperson", 'aperson@stonybrook.edu','password1',60,false,false,false,false,false ); 
    let u3 =await userCreate(false, "another", 'another@stonybrook.edu','password2',60,false,false,false,false,false ); 

    let c1 = await commentCreate('i dont get it', 'aperson',u2, false);
    let c2 = await commentCreate('lol me neither', 'another',u3, false);
    let c3 = await commentCreate('yeah', 'aperson',u2, false);
    let c4 = await commentCreate('no', 'another', u3,false);
    let t1 = await tagCreate('react');
    let t2 = await tagCreate('javascript');
    let t3 = await tagCreate('android');
    let t4 = await tagCreate('shared');

    let a1 = await answerCreate('React Router is mostly a wrapper around the history library. history handles interaction with the browser\'s window.history for you with its browser and hash histories. It also provides a memory history which is useful for environments that don\'t have a global history. This is particularly useful in mobile app development (react-native) and unit testing with Node.', [c3, c4], 'aperson',u2, false);
    let a2 = await answerCreate('On my end, I like to have a single history object that I can carry even outside components. I like to have a single history.js file that I import on demand, and just manipulate it. You just have to change BrowserRouter to Router, and specify the history prop. This doesn\'t change anything for you, except that you have your own history object that you can manipulate as you want. You need to install history, the library used by react-router.', false, 'another',u3, false);
    let a3 = await answerCreate('Consider using apply() instead; commit writes its data to persistent storage immediately, whereas apply will handle it in the background.', false, 'aperson',u2, false);
    let a4 = await answerCreate('YourPreference yourPrefrence = YourPreference.getInstance(context); yourPreference.saveData(YOUR_KEY,YOUR_VALUE);', false,'aperson', u2,false);
    let a5 = await answerCreate('I just found all the above examples just too confusing, so I wrote my own. ', false,'another', u3,false);
    let q1= await questionCreate('Programmatically navigate using React router', 'the alert shows the proper index for the li clicked, and when I alert the variable within the last function I\'m calling, moveToNextImage(stepClicked), the same value shows but the animation isn\'t happening. This works many other ways, but I\'m trying to pass the index value of the list item clicked to use for the math to calculate.', [t1, t2], [a1, a2], [c1, c2], 'aperson',u2, false, false);
    let q2= await questionCreate('android studio save string shared preference, start activity and load the saved string', 'I am using bottom navigation view but am using custom navigation, so my fragments are not recreated every time i switch to a different view. I just hide/show my fragments depending on the icon selected. The problem i am facing is that whenever a config change happens (dark/light theme), my app crashes. I have 2 fragments in this activity and the below code is what i am using to refrain them from being recreated.', [t3, t4], [a3, a4, a5], false, 'another',u3, false, 121);
   
    await updateUser(u2,[t1,t2],[a1,a3,a4],[q1],[c1,c3]);
    await updateUser(u3,[t3,t4],[a2,a5],[q2],[c2,c4]);

    
    if (db) db.close();
    console.log('done');
}

populate()
    .catch((err) => {
        console.log('ERROR: ' + err);
        if (db) db.close();
    });

console.log('processing ...');