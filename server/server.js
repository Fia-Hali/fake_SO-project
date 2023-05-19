//import
const express = require('express');
const session = require("express-session")
const app = express()
app.use(express.urlencoded({ extended: false }))

var cors = require('cors');
app.use(cors());
const port = 8000;

//connect
app.listen(port, () => {
  console.log(`server open on port ${port}`)
})

let Answers = require('./models/answers');
let Questions = require('./models/questions');
let Tags = require('./models/tags');
let Comments = require('./models/comments');
let Users = require('./models/users');

let AddNew = require('./addObject');
let mongoose = require('mongoose');
const tags = require('./models/tags');
const { signUp } = require('./signup');
const MongoStore = require("connect-mongo")
let mongoDB = "mongodb://127.0.0.1:27017/fake_so";

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.on('connected', function () {
  console.log('hw3 Connected to database');
});

// Create a new MongoStore instance
const store = new MongoStore({
  // MongoDB connection options
  mongoUrl: mongoDB,
  collection: "sessions", // Optional: Specify the collection name for storing sessions
  ttl: 3600, // Optional: Set the session expiration time in seconds (default: 14 days)
});

const ObjectId = mongoose.Types.ObjectId;
app.use(express.json());

// Set up session middleware
app.use(
  session({
    secret: 'secret to sign session cookie', // Replace with your own secret key
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, // Set to true if using HTTPS
      httpOnly: true,
      maxAge: 2 * 60 * 60 * 1000, // Cookie expiration time (in milliseconds), here set to 2 hours
    },
    store: store,
    // MongoStore.create({ client: client })
  })
);

//get answers
app.get('/answer', (req, res) => {

  show_all_ans
    .then(answer => {
      res.json(answer);
    })
    .catch((err) => {
      console.error(err);
    })

  Answers.find({})
    .then(answer => {
      res.json(answer);
    })
    .catch((err) => {
      console.error(err);
    })

})

app.get('/answer/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const object = await Answers.findOne({ _id: new ObjectId(id) });
    res.json(object);
  } catch (error) {
    res.json({ message: error.message });
  }
});

//get tags
app.get('/tag', (req, res) => {
  Tags.find({})
    .then(tag => {
      res.json(tag);
    })
    .catch((err) => {
      console.error(err);
    })
})

app.get('/tag/:name', async (req, res) => {

  const tagObjects = await Tags.findOne({ name: { $in: req.params.name } })
    .then(tag => {
      res.json(tag);
    })
    .catch((err) => {
      console.error(err);
    })


})

app.get('/tagunique', async (req, res) => {
  try {
    const tag = await Tags.aggregate([
      { $group: { _id: '$name', count: { $sum: 1 } } },
      { $project: { _id: 0, name: '$_id', count: 1 } }
    ]);
    console.log("Tas is loading")
    const objectList = tag.map(t => ({ name: t.name, count: t.count }));
    res.json(objectList);
  } catch (error) {
    res.json({ message: error.message });
  }
})

//questionsPage
//get questions
app.get('/question', (req, res) => {
  Questions.find({}).sort({ ask_date_time: -1 }).exec()
    .then(questions => {
      res.json(questions);
    })
    .catch((err) => {
      console.error(err);
    })
})

//getTagsNameByQuestionId
app.get('/question/tagsName/:qID', async (req, res) => {
  try {
    const question = await Questions.findById(req.params.qID).populate('tags');
    const tagName = question.tags.map(tag => tag.name);
    res.json(tagName);
  } catch (err) {
    res.json(err);
  }
});

//getAnsByQuestionId
app.get('/question/active/:qid', async (req, res) => {
  try {
    const quesWithAns = await Questions.findById(req.params.qid).populate({
      path: "answers",
      populate: {
        path: "comments",
        model: "Comment"
      }
    });

    // for (const answer of quesWithAns.answers) {
    //   await answer.populate("comments").execPopulate();
    // }

    let ans = quesWithAns.answers;
    res.send(ans);

  }
  catch (err) {
    console.log("question answers not access => " + err);
  }
});

app.get('/question/comment/:qid', async (req, res) => {
  try {
    const quesWithcomt = await Questions.findById(req.params.qid).populate('comments');
    let comt = quesWithcomt.comments;
    // console.log(comt);
    res.send(comt);

  }
  catch (err) {
    console.log("question comments not access => " + err);
  }
});

app.get('/question/answer/comment/:qid', async (req, res) => {
  try {
    const quewithAandC = await Questions.findById(req.params.qid)
      .populate({
        path: 'answers',
        populate: {
          path: 'comments'
        }
      });

    // let comt = quewithAandC.Answerscomments;

    // console.log(quewithAandC);
    res.send(quewithAandC);

  }
  catch (err) {
    console.log("question comments not access => " + err);
  }
});

//update view
app.get('/quesIDView/:qID', async (req, res) => {
  console.log("view is  here => we get in");
  Questions.findByIdAndUpdate(req.params.qID, { $inc: { views: 1 } })
    .then(updatedQuestion => {// The `views` property of the updated question will be incremented by 1
      // console.log(updatedQuestion.views);
    })
    .catch(error => {
      console.error(error);
    });
});

async function updateVote(req, res, obj) {
  const UporDown = req.params.UporDown;
  // const UporDown = 0;

  console.log(UporDown)
  console.log(obj)
  console.log(req.params.qID)

  if (UporDown === 1) {
    if (obj === "answer") {
      console.log("answer up")

      await Answers.findByIdAndUpdate(req.params.qID, { $inc: { vote: 1 } })
        .then(updatedQuestion => {// The `views` property of the updated question will be incremented by 1
          console.log(updatedQuestion.views);
        })
        .catch(error => {
          console.error(error);
        });
    }
    else if (obj === "comment") {
        console.log("comment here")
        await Comments.findByIdAndUpdate(req.params.qID, { $inc: { vote: 1 } })
        .then(updatedQuestion => {// The `views` property of the updated question will be incremented by 1
          // console.log(updatedQuestion.views);
        })
        .catch(error => {
          console.error(error);
        });
    }
    else if (obj === "question") {
      console.log("here")
      await Questions.findByIdAndUpdate(req.params.qID, { $inc: { vote: 1 } })
        .then(updatedQuestion => {// The `vote` property of the updated question will be incremented by 1
          // console.log(updatedQuestion.vote);
        })
        .catch(error => {
          console.error(error);
        });
    }
  }

  if (UporDown === 0){
    if(obj === "answer") {
      await Answers.findByIdAndUpdate(req.params.qID, { $inc: { vote: -1 } })
      .then(updatedQuestion => {// The `views` property of the updated question will be incremented by 1
        // console.log(updatedQuestion.views);
      })
      .catch(error => {
        console.error(error);
      });
  }
  else if (obj === "question") {
    console.log("here")
    await Questions.findByIdAndUpdate(req.params.qID, { $inc: { vote: -1 } })
      .then(console.log("q vote+1"))
      .catch(error => {
        console.error(error);
      });
  }

  }
}

app.get('/ansIDVote/:UporDown/:qID', (req, res) => {
  updateVote(req, res, "answer")
});

app.get('/comtIDVote/:UporDown/:qID', async (req, res) => {
  updateVote(req, res, "comment")

});

app.get('/quesIDVote/:UporDown/:qID', async (req, res) => {
  updateVote(req, res, "question")

});

//search
app.get('/search/:text', async (req, res) => {
  // GET http://localhost:8000/question/text
  const intext = req.params.text;
  // console.log(intext);

  const tags = [];
  const nonTags = [];

  // Split the search string into tag names and non-tag words
  intext.split(/\s+/).forEach(term => {
    if (term.startsWith('[') && term.endsWith(']')) {
      tags.push(term.substring(1, term.length - 1));
    } else {
      nonTags.push(term);
    }
  });

  console.log(tags + " another: " + nonTags);

  // Find all the tags that match the tag names
  const tagObjects = await Tags.find({ name: { $in: tags } });

  // Get an array of the tag objectIds
  const tagIds = tagObjects.map(tag => tag._id);

  // Construct the query to search for Questions with the matching tags or non-tags
  let query = {};
  if (tagIds.length > 0) {
    query.tags = { $in: tagIds };
  }

  if (nonTags.length > 0) {
    const nontagQuery = nonTags.map((word) => {
      return { title: { $regex: word, $options: 'i' } };
    });
    query.$or = nontagQuery;
  }

  try {
    console.log("finding...");
    const questions = (await Questions.find(query));
    if (questions.length === 0) {
      res.status(404).json([]);
    } else {
      res.send(questions);
    }
  } catch (err) {
    res.status(500).json({ message: err.message + " don't know what they are doing" });
  }
})


//add questions
app.post('/newQuestion', (req, res) => {
  console.log("new question");
  AddNew.newQuestion(res, req.body.title, req.body.text, req.body.tags);
})

//add answers
app.post('/newAnswer', (req, res) => {
  console.log("new answer");
  AddNew.newAnswer(res, req.body.text, req.body.ans_by, req.body.question);
}
)

//add comment
app.post('/newComment', (req, res) => {
  console.log("new comment");
  AddNew.newComment(res, req.body.text, req.body.comt_by, req.body.comt_by_user, req.body.obj, req.body.AorQ);
}
)

//sign up
app.post('/signup', (req, res) => {
  signUp(req, res);
})

// Login 
app.post('/login', express.urlencoded({ extended: false }), (req, res) => {
  const { email, password } = req.body;

  const login = async() => {
    console.log(email);
    try {
      const user = await Users.findOne({ email: email });
  
      if (!user) {
        return res.status(401).json({ message: 'Oops, the account does not exist. \nWould you like to sign up?' });
      }
      // isPasswordValid = await bcrypt.compare(password, user.password)
      if (password !== user.password) {
        return res.status(401).json({ message: 'Wrong password. Please try agin' });
      }
      console.log("login find user: "+ user.name);
      // Store user's session information
      res.cookie('userCookie', 'cookie-value', { maxAge: 3600000, httpOnly: true });
      req.session.userId = user._id;
      req.session.save(
      function (err) {
        if (err) return console.log(err);
      })
  
      return res.status(200).json( { message: 'Login successful', uid: user._id});
    } catch (error) {
      console.log('Can not connect to database, please try again');
      res.status(500).json({ message: "Can not connect to database. Please try again later" });}
  }
  return login(req, res);
});

// Logout route
app.post('/logout', (req, res) => {
  // Clear user's session information
  req.session.destroy((error) => {
    if (error) {
      console.error('Error logging out:');
      return res.status(500).json({ message: 'Failed to logout: can not connext to database' });
    }
    return res.status(200).json({ message: 'Logout successful' });
  });
});

//get user
app.get("/user/:uid", (req,res)=>{
 getUser(req,res);
})

async function getUser(req, res){
    // Retrieve the user information based on the stored user ID
    const uid = req.params.uid;
    Users.findById(uid)
    .then(user=>res.json(user))
    .catch(error=> {
      console.error('Error retrieving user information:');
      res.status(500).json({ message: 'Failed to retrieve user information' });
    })
}

