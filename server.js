const useragent = require('express-useragent');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const express = require('express');
const morgan = require('morgan');

const cors = require('./middleware/cors');
const env = require('./env');

mongoose.connect(env.mongoURL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
}, (err) => {
  if (err) throw err;
});

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(useragent.express());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(morgan('tiny'));
app.use(cors());

app.use('/v1/widgets', require('./routes/widgets'));
app.use('/v1/uploads', require('./routes/uploads'));
app.use('/v1/users', require('./routes/users'));

app.listen(env.port, () => console.log(`[express] app listening on http://localhost:${env.port}`));