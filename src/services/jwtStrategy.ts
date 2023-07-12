import passport from 'passport';
import passportJWT from 'passport-jwt';

import { User } from './../models/user';

export default function JWTStrategy() {
  const ExtractJwt = passportJWT.ExtractJwt;
  const JwtStrategy = passportJWT.Strategy;
  const jwtOptions: any = {};

  jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  jwtOptions.secretOrKey = process.env.JWT_SECRET;

  const strategy = new JwtStrategy(jwtOptions, async function (
    jwt_payload,
    done,
  ) {
    const user = await getUser({ id: jwt_payload.id });
    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });

  passport.use('jwt', strategy);

  async function getUser(currentUser: { id: object }): Promise<any> {
    try {
      const user = await User.findById(currentUser.id);

      user.password = undefined;

      return user;
    } catch (error) {
      return null;
    }
  }
}
