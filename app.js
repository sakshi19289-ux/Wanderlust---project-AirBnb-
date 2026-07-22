const express = require ("express");
const app = express();
const mongoose = require("mongoose")
const Listing = require("./models/listing.js")

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust"
    
main().then(()=>{
    console.log("Connected to DB")
})
.catch((err)=>{
    console.log(err);
})
async function main(){
    await mongoose.connect(MONGO_URL);
}

app.get("/testListing",async (req,res)=>{
    let sampleListing = new Listing({
        title: "My new Home",
        description: "By the beach",
        price:1200,
        location:"Calungate, goa",
        country:"India"
    })
    await sampleListing.save();
})

app.get("/", (req,res)=>{
    res.send("Hello i am root ")
})

app.listen("8080",()=>{
    
        console.log("server is listening on port 8080 ")
})