// Tag Document Schema

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Tag= new Schema({
    name:{
        type:String,
        required:[true, "need content"],
        maxLength:10
    }
});

//url:String
Tag
.virtual('url')
.get(function () {
  return '/posts/tag/' + this._id;
});

module.exports = mongoose.model('Tag', Tag);
