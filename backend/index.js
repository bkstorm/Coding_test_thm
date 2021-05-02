const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const morganMiddleware = require('./middelware/logger');
const passport = require('./middelware/passport');
const authRouter = require('./routes/auth.route');
const userRouter = require('./routes/user.route');

const port = 3002;

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);
app.use(passport);
app.use(morganMiddleware);
app.use(authRouter);
app.use(userRouter);
app.get('/health', (req, res) => res.send({ message: 'ok' }));

const server = app.listen(port, () => {
  console.log(`THM App running on port ${port}.`);
});
module.exports = server;
