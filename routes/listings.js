const express = require("express");
const router = express.Router();
const {listingSchema} = require('../schema.js');
const ExpressError = require("../utils/ExpressError.js")
const Listing = require("../models/listing.js");

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
router.get("/", async (req,res)=>{
  let allListings = await Listing.find({})
    res.render("listings/index.ejs",{allListings})
})

//New Route (create) - keeping it above show route as new is treated as an ID
router.get("/new",(req,res)=>{
    res.render("listings/new.ejs")
})

//show route (read)
router.get("/:id",async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id).populate("reviews")
    if(!listing){
        throw new ExpressError(404, "Listing not found")
    }
    res.render("listings/show.ejs",{listing})
})

//Create route
router.post("/",validateListing, async(req,res)=>{
    const newListing =  new Listing(req.body.listing);
    await newListing.save()
    res.redirect("/listings");
})

//edit route
router.get("/:id/edit", async(req,res)=>{
    let {id}=req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        throw new ExpressError(404,"Listing not found");
    }
    res.render("listings/edit.ejs",{listing})
})

//update route 
router.put("/:id", validateListing, async (req, res)=>{
    let {id}=req.params;
    let updatedListing = await Listing.findByIdAndUpdate(id, {...req.body.listing},{runValidators:true} )    
    if(!updatedListing){
    throw new ExpressError(404,"Listing not found");
}
   res.redirect(`/listings/${id}`);
})

//delete route
router.delete("/:id", async (req,res)=>{
    let {id} = req.params;
    let deletedListing= await Listing.findByIdAndDelete(id);
    if(!deletedListing){
        throw new ExpressError(404,"Listing not found");
    }
    res.redirect("/listings");
})

module.exports = router;