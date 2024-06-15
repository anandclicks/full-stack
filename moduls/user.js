const mongoose = require('mongoose')
const post = require('./post')
mongoose.connect("mongodb://127.0.0.1:27017/usercreatin")
post
const user = mongoose.Schema({
    username : String,
    name : String,
    email : String,
    password : String,
    posts : [
        { type: mongoose.Schema.Types.ObjectId, ref: 'post' }
    ],
    
})

module.exports = mongoose.model('user', user)