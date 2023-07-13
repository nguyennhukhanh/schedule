import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import passport from 'passport';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';

import Module from './modules';
import JWTStrategy from './services/jwtStrategy';
import error from './middlewares/error';
import connect from './common/database';
import * as swaggerDocument from './common/docs/swagger.json';

const app = express();
dotenv.config();

connect();

app.use(cors());

// Middleware for all method
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Use static
app.use('/static', express.static(path.join(__dirname, '..', 'public')));

// Use Helmet!
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", process.env.DOMAIN_OPTIONAL],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
  }),
);
app.use(helmet.crossOriginOpenerPolicy({ policy: 'same-origin' }));
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
  }),
);

//Module init
const initModule = new Module(app);
initModule.main();

// Use passport
JWTStrategy();
app.use(passport.initialize());

// Use middleware error handler
app.use(error);

// Configuring trust proxy
app.set('trust proxy', true);

// Swagger
app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(parseInt(process.env.PORT) || 3000, () => {
  console.info(`Server listening on port ${process.env.PORT || 3000}`);
});
