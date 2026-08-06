const mongoose = require("mongoose");
const Schema= mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true,
        maxlength:500
    },
    
    image: {
    filename: {
        type: String,
    },
    url: {
        type: String,
    },
},

    price:{
        type:Number,
        required:true,
        min:0
    },
    location:{
        required:true,
        type:String,
    },
    country:{
        type:String,
        required:true
    },
})

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;