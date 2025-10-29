import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { env } from './env';
import { UserModel } from '../models/User';

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: env.JWT_ACCESS_SECRET,
    },
    async (payload, done) => {
      try {
        const user = await UserModel.findById(payload.userId);
        if (!user) return done(null, false);
        return done(null, user);
      } catch (err) {
        return done(err, false);
      }
    },
  ),
);

if (env.OAUTH_GOOGLE_CLIENT_ID && env.OAUTH_GOOGLE_CLIENT_SECRET && env.OAUTH_CALLBACK_URL) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: env.OAUTH_GOOGLE_CLIENT_ID,
        clientSecret: env.OAUTH_GOOGLE_CLIENT_SECRET,
        callbackURL: `${env.OAUTH_CALLBACK_URL}/google/callback`,
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value?.toLowerCase();
          if (!email) return done(null, false);
          let user = await UserModel.findOne({ email });
          if (!user) {
            user = await UserModel.create({ email, name: profile.displayName || 'Google User', passwordHash: 'oauth2', roles: ['viewer'] });
          }
          return done(null, user);
        } catch (err) {
          return done(err, false);
        }
      },
    ),
  );
}

if (env.OAUTH_GITHUB_CLIENT_ID && env.OAUTH_GITHUB_CLIENT_SECRET && env.OAUTH_CALLBACK_URL) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: env.OAUTH_GITHUB_CLIENT_ID,
        clientSecret: env.OAUTH_GITHUB_CLIENT_SECRET,
        callbackURL: `${env.OAUTH_CALLBACK_URL}/github/callback`,
        scope: ['user:email'],
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const email = (profile.emails && profile.emails[0]?.value?.toLowerCase()) || `${profile.username}@users.noreply.github.com`;
          let user = await UserModel.findOne({ email });
          if (!user) {
            user = await UserModel.create({ email, name: profile.displayName || profile.username || 'GitHub User', passwordHash: 'oauth2', roles: ['viewer'] });
          }
          return done(null, user);
        } catch (err) {
          return done(err, false);
        }
      },
    ),
  );
}

export default passport;
