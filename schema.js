const Joi = require("joi");

module.exports.listingSchema = Joi.object({
    listing:Joi.object({
        title: Joi.string().required(), //title type should be string and required
        description: Joi.string().required(),
        Country:Joi.string().required(),
        price:Joi.number().required().min(0),
        image: Joi.string().allow("", null)
    }).required()
})   