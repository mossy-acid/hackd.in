const request = require('request');
// const session = require('express-session');

exports.validateUser = (req, res, next) => {
  if (req.session.engineer) {
    console.log('Authenticated session exists');
    next();
  } else {
    console.log('Invalid session');
    res.redirect('index');
  }
};
