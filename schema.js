const Joi = require("joi");

const listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().min(0).required(), // Ensure `min(0)` comes before `required()`
    price: Joi.number().required(),
    image: Joi.string().required(),
  }).required(),
});

module.exports = listingSchema;
