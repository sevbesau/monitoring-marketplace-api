const mongoose = require('mongoose');
const express = require('express');
const morgan = require('morgan');

const env = require('./env');

mongoose.connect(env.mongoURL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
}, (err) => {
  if (err) throw err;
});

const app = express();

app.use(morgan('tiny'));

app.use('/v1/widgets', require('./routes/v1/widgets'));

app.listen(env.port, () => console.log(`[express] app listening on http://localhost:${env.port}]`));