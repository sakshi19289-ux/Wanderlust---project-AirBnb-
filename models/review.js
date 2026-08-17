const mongoose = require("mongoose");
const Schema= mongoose.Schema;

const reviewSchema = new Schema({
    review:{
        type:String
    },
    rating:{
        type:String,
        min:1,
        max:5
    }, 
    createdAt:{
        type:Date,
        defaut:Date.now()
    }
}) 

module.exports = mongoose.model("Review", reviewSchema);