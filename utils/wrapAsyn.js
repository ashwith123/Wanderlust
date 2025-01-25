// utils/wrapAsync.js
module.exports = (fn) => {
  //this is instead of try catch
  return function (req, res, next) {
    // If the async function throws an error, it will be passed to the next error handler
    fn(req, res, next).catch(next);
  };
};

//function wrapAsync(fn){
// return function(req,res,next){
// }}
