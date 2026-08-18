const express = require("express");
const router = express.Router({mergeParams:true});
const {reviewSchema} = require('../schema.js');
const Review = require("../models/review.js");
const ExpressError = require("../utils/ExpressError.js")
const Listing = require("../models/listing.js");


const validateReview = (req,res,next)=>{
 let {error} = reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error)
    }
    else{
        next();
    }
}

//post review route
router.post("/", validateReview , async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save()//to save new review doc in rev collection array
    await listing.save()//to save new review in db
    res.redirect(`/listings/${listing._id}`)
})

// delete review route
router.delete("/:reviewId", async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id, {$pull : {reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId)

    res.redirect(`/listings/${id}`)
})

module.exports = router;