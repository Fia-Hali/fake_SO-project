// Question Document Schema
// let async = require('async');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Question= new Schema({
    title:{
        type:String,
        maxLength:100,
        required:[true, "need title"]
    },
    text:{
        type:String,
        required:[true, "need content"],
        // maxLength:100
    },
    tags:[{
        type:Schema.Types.ObjectId, ref:'Tag',
        required:[true, "need tags"],
    }],
    answers:[{
        type:Schema.Types.ObjectId, ref:'Answer'
    }],
    comments:[{
        type:Schema.Types.ObjectId, ref:'Comment'
    }],
    asked_by:{
        type:String,
        default:"Anonymous"
    },
    ask_by_user:{
        type:Schema.Types.ObjectId, ref:'User'
    },
    ask_date_time:{
        type:Date,
        default: Date()
    },
    views:{
        type:Number,
        default:0
    },
    vote:{
        type:Number,
        default:0
    }
});

//url:String
Question
.virtual('url')
.get(function () {
  return '/posts/question/' + this._id;
});

module.exports = mongoose.model('Question', Question);
