import passport from 'passport';

export const jwtGuard = passport.authenticate('jwt', { session: false });
