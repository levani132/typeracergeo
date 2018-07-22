const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const {User} = require('./schemes')
const sha256 = require('sha256')

passport.use(new LocalStrategy(
    function(username, password, done) {
        User.findOne({ name: username }, function (err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'Incorrect username' });
            }
            if (user.passwordHash != sha256(password)) {
                return done(null, false, { message: 'Incorrect password' });
            }
            return done(null, user);
        });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

module.exports = passport