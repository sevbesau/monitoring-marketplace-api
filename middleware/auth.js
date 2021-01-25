/*

  This is a controller which handles everything for Authentificaiton.

*/

const Users = require('../models/users');
const Sessions = require('../models/sessions');
const ObjectId = require('mongoose').Types.ObjectId;

const bcrypt = require('bcryptjs');

const hashIt = password => new Promise((resolve) => {
  bcrypt.genSalt(3, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
      resolve(hash);
    });
  });
});


const signup = async (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    return res.json({ error: 'Not all fields are set.' });
  }

  const existingUser = await Users.findOne({ email: req.body.email.toLowerCase() });
  if (existingUser && existingUser._id) {
    return res.json({ error: 'User with this email already found.' });
  }

  const hash = await hashIt(req.body.password);
  const user = await new Users({
    firstname: req.body.firstname || '',
    lastname: req.body.lastname || '',
    username: req.body.firstname.split(' ').join('-'),
    email: req.body.email.toLowerCase(),
    password: hash,
  }).save();

  new Sessions({
    user: user._id,
    ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress || '',
    ua: req.useragent.source,
    isMobile: req.useragent.isMobile,
    version: req.useragent.version,
    browser: req.useragent.browser,
    os: req.useragent.os,
    platform: req.useragent.platform,
    active: true,
    country: (req.headers['cf-ipcountry'] || ''),
    email: req.body.email.toLowerCase(),
    method: 'EMAIL', // for now the only method
  }).save((err, data) => {
    if (err) console.log(err);
    res.json({ success: true, token: data._id });
  });
};

const login = (req, res, next) => {
  if (req.body.email && req.body.password) {
    Users.findOne({
      email: req.body.email.toLowerCase(),
    }).exec((err, user) => {
      if (err) console.log(err);
      if (user && user._id) {
        bcrypt.compare(req.body.password, user.password, (err, same) => {
          if (err) console.log(err);
          if (same) {
            if (user.blocked) {
              res.json({ success: false,
                error: 'User is blocked',
              });
            } else {
              new Sessions({
                user: user._id,
                ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress || '',
                ua: req.useragent.source,
                isMobile: req.useragent.isMobile,
                version: req.useragent.version,
                browser: req.useragent.browser,
                os: req.useragent.os,
                platform: req.useragent.platform,
                active: true,
                country: (req.headers['cf-ipcountry'] || ''),
                email: req.body.email.toLowerCase(),
                method: 'EMAIL', // for now the only method
              }).save((err, data) => {
                if (err) console.log(err);

                console.log(`New login for ${req.body.email.toLowerCase()} from ${req.headers['cf-ipcountry'] || 'Unknown'}`);
                res.json({ success: true, token: data._id });
              });
            }
          } else {
            console.log('Incorrect password');
            res.json({
              success: false,
              error: 'Incorrect password.',
            });
          }
        });
      } else {
        res.json({
          success: false,
          error: 'User not found.',
        });
      }
    });
  } else {
    res.json({
      success: false,
      error: 'Not all fields are set.',
    });
  }
};

const check = (req, res, next) => {
  if (req.query.token) {
    req.headers.authorization = req.query.token;
  }

  if (typeof req.headers.authorization === 'undefined' || (req.headers.authorization.replace('Bearer ', '').length <= 0)) {
    res.status(401);
    console.log('Unauthorized (missing authorization header) (A1)');
    res.end('Unauthorized (A1)');
  } else {
    const bearer = req.headers.authorization.replace('Bearer ', '');
    if (!bearer || !ObjectId.isValid(bearer)) {
      res.status(401);
      console.log('Unauthorized: incorrect bearer token (A5)');
      res.json('Unauthorized (A5)');
    } else {
      console.log('bearer:', bearer);
      Sessions.findOne({
        _id: bearer,
        active: true,
      }).populate('user').lean().exec(async (err, session) => {
        if (err) {
          console.log(err);
          res.status(401);
          console.log('Unauthorized (A3)');
          res.json('Unauthorized (A3)');
        } else if (session && session.user && session.user._id) {
          delete session.user.password; // remove the password field
          req.user = session.user;
          next();
          Users.updateOne({ _id: session.user._id }, { $set: {
            lastActive: new Date(),
          } }).exec((err) => {
            if (err) console.log(err);
          });
        } else {
          console.log(session);
          console.log('Unauthorized API call made (A4)');
          res.status(401);
          res.json('Unauthorized (A4)');
        }
      });
    }
  }
};

const resetPassword = (req, res, next) => {
  // Todo
  res.json({
    error: 'Still working on this feature',
  });
};


module.exports = {
  login,
  signup,
  check,
  resetPassword,
};
