import {User} from '../user/user';
import {Strategy as LocalStrategy} from 'passport-local';
import {userService} from '../user/user-service';
import {Partial} from 'lodash';

export const passportConfig = (passport) => {

  // =========================================================================
  // passport session setup ==================================================
  // =========================================================================
  // required for persistent login sessions
  // passport needs ability to serialize and unserialize users out of session

  // used to serialize the user for the session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser((id, done) => {
    userService.findSingle({id: id})
      .then(user => {
        return done(null, user);
      })
      .catch(err => {
        return done(err);
      });
  });

  // =========================================================================
  // LOCAL SIGNUP ============================================================
  // =========================================================================
  // we are using named strategies since we have one for login and one for signup
  // by default, if there was no name, it would just be called 'local'

  passport.use('local-signup', new LocalStrategy({
      // by default, local strategy uses username and password, we will override with email
      usernameField : 'username',
      passwordField : 'password',
      passReqToCallback : true // allows us to pass back the entire request to the callback
    },
      (req, username, password, done) => {

        userService.findSingle({'username': username})
          .then(user => {
            if (user) {
              return done(null, false, {message: 'signupMessage. That email is already taken.'});
            } else {
              const hashPassword = (new User()).generateHash(password);
              const partialUser: any = {username: username, password: hashPassword };
              return userService.create(partialUser)
                .then(newUser => {
                  return done(null, newUser);
                })
            }
          })
          .catch(err => {
            done(err);
          });

    }));

  // =========================================================================
  // LOCAL LOGIN =============================================================
  // =========================================================================
  // we are using named strategies since we have one for login and one for signup
  // by default, if there was no name, it would just be called 'local'

  passport.use('local-login', new LocalStrategy({
      // by default, local strategy uses username and password, we will override with email
      usernameField    : 'email',
      passwordField    : 'password',
      passReqToCallback: true // allows us to pass back the entire request to the callback
    },
    (req, email, password, done) => { // callback with email and password from our form

      // find a user whose email is the same as the forms email
      // we are checking to see if the user trying to login already exists
      userService.findSingle({'email': email})
        .then(user => {

          if (!user)
            return done(null, false, {message: 'loginMessage, No user found.'}); // req.flash is the way to set flashdata using connect-flash

          // if the user is found but the password is wrong
          if (!user.validPassword(password))
            return done(null, false, {message: 'loginMessage, Oops! Wrong password.'}); // create the loginMessage and save it to session as flashdata

          // all is well, return successful user
          return done(null, user);
        })
        .catch(err => {
          done(err);
        });

    }));

};
