const sanitizer = require('sanitizer');

module.exports = (req, res, next) => {
  // pour chq propriété de req.body,
  for( let prop in req.body ) {
    // je l'assainit !
    req.body[prop] = sanitizer.escape( req.body[prop] );
  }

  next();
};