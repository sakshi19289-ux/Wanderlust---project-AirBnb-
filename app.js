const express = require ("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate")
const ExpressError = require("./utils/ExpressError.js")
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust"
const {listingSchema} = require('./schema.js');
main().then(()=>{
    console.log("Connected to DB")
})
.catch((err)=>{
    console.log(err);
})
async function main(){
    await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views",path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method")); 
app.use(express.static(path.join(__dirname,"public")))
app.engine("ejs",ejsMate),//use ejs-locals for all ejs templates
app.use(express.json()); //for hoppscotch testing

app.get("/", (req,res)=>{
    res.send("Hello i am root ")
})
const validateListing = (req,res,next)=>{
 let {error} = listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error)
    }
    else{
        next();
    }
}

//Index route
app.get("/listings", async (req,res)=>{
  let allListings = await Listing.find({})
    res.render("listings/index.ejs",{allListings})
})

//New Route (create) - keeping it above show route as new is treated as an ID
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs")
})

//show route (read)
app.get("/listings/:id",async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id)
    if(!listing){
        throw new ExpressError(404, "Listing not found")
    }
    res.render("listings/show.ejs",{listing})
})

//Create route
app.post("/listings",validateListing, async(req,res)=>{
    const newListing =  new Listing(req.body.listing);
    await newListing.save()
    res.redirect("/listings");
})

//edit route
app.get("/listings/:id/edit", async(req,res)=>{
    let {id}=req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        throw new ExpressError(404,"Listing not found");
    }
    res.render("listings/edit.ejs",{listing})
})

//update route 
app.put("/listings/:id", validateListing, async (req, res)=>{
    let {id}=req.params;
    let updatedListing = await Listing.findByIdAndUpdate(id, {...req.body.listing},{runValidators:true} )    
    if(!updatedListing){
    throw new ExpressError(404,"Listing not found");
}
   res.redirect(`/listings/${id}`);
})

//delete route
app.delete("/listings/:id", async (req,res)=>{
    let {id} = req.params;
    let deletedListing= await Listing.findByIdAndDelete(id);
    if(!deletedListing){
        throw new ExpressError(404,"Listing not found");
    }
    res.redirect("/listings");
})
app.all("/{*splat}",(req,res,next)=>{
    next(new ExpressError(404, "page not found"));
})

//err handling middleware
app.use((err,req,res,next)=>{
    let {statusCode = 500, message="Something went wrong"} =err;
    res.status(statusCode).render("listings/error.ejs", {message})
    // res.status(statusCode).send(message);
})

app.listen("8080",()=>{
        console.log("server is listening on port 8080 ")
})