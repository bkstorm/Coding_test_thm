const passport = require('passport');
const passportJWT = require('passport-jwt');
const { to } = require('await-to-js');
const { getUser } = require('../services/user.service');

passport.use(
  'user',
  new passportJWT.Strategy(
    {
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
    },
    async (payload, done) => {
      if (!payload.sub) {
        done();
      }
      const [error, user] = await to(
        getUser(payload.sub),
      );
      if (error) {
        return done(error);
      }
      return done(null, user);
    },
  ),
);

module.exports = (req, res, next) => {
  passport.authenticate('user', { session: false }, (err, user) => {
    if (err) {
      next(err);
      return;
    }
    if (user) {
      req.user = user;
    }
    next();
  })(req, res, next);
};
