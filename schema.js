const Joi = require("joi");

const listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().min(0).required(), // Ensure `min(0)` comes before `required()`
    price: Joi.number().required(),
    latitude: Joi.number().min(-90).max(90).required(),
    longitude: Joi.number().min(-180).max(180).required(),
    image: Joi.object({
      url: Joi.string().required(),
    }),
  }).required(),
});

module.exports = listingSchema;
