
FROM node:20-alpine

WORKDIR /app

COPY package.json yarn.lock ./

COPY tsconfig.build.json tsconfig.build.json
COPY tsconfig.json tsconfig.json

COPY ./src ./src

ENV PORT=5555
ENV JWT_SECRET=
ENV MONGODB_URL=
ENV DOMAIN_OPTIONAL=
ENV ADMIN_MAIL=
ENV ADMIN_FIRSTNAME=
ENV ADMIN_LASTNAME=
ENV ADMIN_PASSWORD=

ENV MAILER_USER=
ENV MAILER_USERNAME=
ENV MAILER_PASSWORD=
ENV MAILER_HOST=
ENV MAILER_PORT=

ENV VERIFICATION_LINK=
ENV INVITE_LINK=

ENV API_KEY_ADDRESS=

ENV SG=7

RUN yarn install \
    && yarn build

EXPOSE 5555

CMD ["node", "dist/app.js"]
