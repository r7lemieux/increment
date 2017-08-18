// import * as Prom from 'bluebird';
import * as passport from 'passport';
import {userService} from '../user/user-service';
import {Application} from 'express';
import {Strategy} from 'passport-facebook';
// import * as LocalStrategy from 'passport-local';
const LocalStrategy = require('passport-local');

export class AuthService {

  protected secret: string;
  constructor() {
  }

  initPassport = (app: Application) => {
    const options = {
      clientID: 'xliwas', // process.env.FACEBOOK_APP_ID,
      clientSecret: 'asdfwegtesa', // process.env.FACEBOOK_APP_SECRET,
      callbackURL: 'http://localhost:3000/auth/facebook/callback'
    };
    this.secret= 'houlahoulahou';
    app.use(passport.initialize());
    app.use(passport.session()); // persistent login sessions

    passport.use(
      new Strategy(
        options,
        function(accessToken, refreshToken, profile, done) {
          // User.findOrCreate(
          //   { facebookId: profile.id },
          //   function (err, result) {
          //     if(result) {
          //       result.access_token = accessToken;
          //       result.save(function(err, doc) {
          //         done(err, doc);
          //       });
          //     } else {
          //       done(err, result);
          //     }
          //   }
          // );
        }
      )
    );

    passport.use(new LocalStrategy(
     function(username, password, done) {
      userService.findOne({ username: username }, (err, user) => {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (!user.verifyPassword(password)) { return done(null, false); }
      return done(null, user);
    });
  }
));
}
}

export const authService: AuthService = new AuthService();
