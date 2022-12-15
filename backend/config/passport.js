const JwtSrategy = require('passport-jwt').Strategy;

const ExtractJwt = require('passport-jwt').ExtractJwt;

const userRepository = require("../repository/userRepository");

const key = process.env.SECRET;

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = key;

// Protectiong the Private Routes

const findUser = async (jwt_payload_id) => {
  try {
      return await userRepository.getUserById(jwt_payload_id)
  } catch (error) {}
};

module.exports = (passport) => {
  passport.use(
    new JwtSrategy(opts, (jwt_payload, done) => {
      const user = findUser(jwt_payload.id);

      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    })
  );
};
