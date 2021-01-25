// Required Node packages
const express = require('express');

const Auth = require('../middleware/auth');
const Cdn = require('../middleware/cdn');
const env = require('../env');

// Required middleware/functions
const router = express.Router();


router.post('/', Auth.check, Cdn.middleware('uploads'), async (req, res) => {
  res.json({
    url: env.cdnURL + req.files[0].cdn.webpath,
  });
});

module.exports = router;
