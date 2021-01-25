// Required Node packages
const express = require('express');
const Auth = require('../middleware/auth');
const Users = require('../models/users');

// Required middleware/functions
const router = express.Router();


router.post('/', Auth.signup); // Signup
router.post('/me', Auth.login); // Login
router.post('/reset-password', Auth.resetPassword); // Login


// TODO: better securen...
router.put('/me', Auth.check, async (req, res) => {
  await Users.update({ _id: req.user._id }, { $set: req.body }).exec();
  return res.json({
    ok: 1,
  });
});

router.get('/me', Auth.check, async (req, res) => {
  console.log('call:', req.user.email);
  res.json(req.user);
});


module.exports = router;
