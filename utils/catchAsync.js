// Function return another function. This is a function that express is then going to call so here is where we then specify req, res and next
// Call function in here and this function should receive req, res, and in fact also next
// Return an anonymous function
// fn(req, res, next).catch(err => next(err));
// module.exports = fn => {
//   return (req, res, next) => {
//     fn(req, res, next).catch(next);
//   };
// };

module.exports = fn => (req, res, next) => {
  fn(req, res, next).catch(next);
};
