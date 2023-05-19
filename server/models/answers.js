// Answer Document Schema

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Answer= new Schema({
    text:{
        type:String,
        required:[true, "need content"],
        // maxLength:100
    },
    comments:[{
        type:Schema.Types.ObjectId, ref:'Comment'
    }],
    ans_by:{
        type:String,
        default:"anonymous"
    },
    ans_by_user:{
        type:Schema.Types.ObjectId, ref:'User'
    },
    ans_date_time:{
        type:Date,
        default:Date(),
    },
    vote:{
        type:Number,
        default:0
    }
});

//Virtual for answer's URL
//url:String
Answer
.virtual('url')
.get(function () {
  return '/posts/answer/' + this._id;
});


//Export model
module.exports = mongoose.model('Answer', Answer);
