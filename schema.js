//used for server side validation

const Joi = require("joi");

const listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string.required(),
    description: Joi.string.required(),
    location: Joi.string.required(),
    country: Joi.string.required().min(0),
    price: Joi.number.required(),
  }).required(),
});

module.exports = listingSchema;
