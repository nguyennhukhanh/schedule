import * as core from 'express-serve-static-core';

import authRouter from './auth/router';
import homeRouter from './home/router';
import profileRouter from './profile/router';
import attendanceRouter from './attendance/router';
import statisticRouter from './statistic/router';
import verifyRouter from './verify/router';
import roomRouter from './room/router';

export default class Module {
  protected app: core.Express;
  constructor(app: core.Express) {
    this.app = app;
  }

  main() {
    this.app.use('/auth', authRouter);
    this.app.use('/profile', profileRouter);
    this.app.use('/room', roomRouter);
    this.app.use('/attendance', attendanceRouter);
    this.app.use('/statistic', statisticRouter);
    this.app.use('/verify', verifyRouter);
    this.app.use('/', homeRouter);
  }
}
