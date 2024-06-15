const mongoose = require("mongoose")
const user = require("./user")

const post = mongoose.Schema({
    title : String,
    dips : String,
    userId : {type : mongoose.Schema.Types.ObjectId,ref : 'user'}
},{timestamps : true})


module.exports = mongoose.model("post", post)