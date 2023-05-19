// Tag Document Schema

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Comment= new Schema({
    text:{
        type:String,
        required:[true, "need text to comment"],
        maxLength:140
    },
    comt_by:{
        type:String,
        required:[true, "need username"]
    },
    comt_by_user:{
        type:Schema.Types.ObjectId, ref:'User'
    },
    comt_date_time:{
        type:Date,
        default:Date(),
    },
    vote:{
        type:Number,
        default:0
    }
    //need constrain for user reputation
});

//url:String
Comment
.virtual('url')
.get(function () {
  return '/posts/comment/' + this._id;
});

module.exports = mongoose.model('Comment', Comment);
