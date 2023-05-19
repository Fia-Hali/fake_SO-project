// Tag Document Schema

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const User= new Schema({
    admin:{
        type:Boolean,
        default:false,
    },
    name:{
        type:String,
        required:[true, "need name"],
    },
    email:{
        type:String,
        required:[true, "need email"],
    },
    password:{
        type:String,
        required:[true, "need email"],
    },
    reputation:{
        type:Number,
        default:50
    },
    time:{
        type:Date,
        default: Date()
    },
    tags:[{
        type:Schema.Types.ObjectId, ref:'Tag',
    }],
    answers:[{
        type:Schema.Types.ObjectId, ref:'Answer'
    }],
    questions:[{
        type:Schema.Types.ObjectId, ref:'Question'
    }],
    comments:[{
        type:Schema.Types.ObjectId, ref:'Comment'
    }],

});

//url:String
User
.virtual('url')
.get(function () {
  return '/posts/user/' + this._id;
});

module.exports = mongoose.model('User', User);
