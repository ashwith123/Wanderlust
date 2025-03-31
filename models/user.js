const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  //here this adds useranme and password to schema but they can be overwriiten
  email: {
    type: String,
    require: true,
  },
});

userSchema.plugin(passportLocalMongoose); // this will perform hashing,salting automatically and username

module.exports = mongoose.model("User", userSchema);
