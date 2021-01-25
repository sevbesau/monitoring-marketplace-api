/*

const cors = require('@middleware/cors');

// CORS
app.use(cors());

*/

module.exports = () => (req, res, next) => {
    // get protocol from refer
  const referer = {};

  referer.url = req.headers.referer || '';
    // protocol from referer.
  referer.protocol = 'http://';
  if (referer.url.indexOf('https://') > -1) {
    referer.protocol = 'https://';
  }

    // page
  referer.host = referer.url.replace(referer.protocol, '').split('/')[0];
  referer.page = referer.url.replace(referer.protocol, '').split(referer.host)[1];
  referer.cookiePath = `${referer.protocol}${referer.host}`;

  req.referer = referer;

  // Open referer if we want
  res.setHeader('Content-type', 'application/javascript');

  res.setHeader('Access-Control-Allow-Origin', referer.cookiePath);
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Request-Method', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');

  // res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Access-Control-Allow-Origin, X-Requested-With, authorization, api-version, project');

  next();
};
