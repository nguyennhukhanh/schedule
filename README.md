# Command
```text

yarn install
yarn start

yarn build

# Format Code
yarn format

# Create An Admin
yarn create-admin

```

# Environment
```env

PORT=
JWT_SECRET=
MONGODB_URL=

DOMAIN_OPTIONAL=

ADMIN_MAIL=
ADMIN_FIRSTNAME=
ADMIN_LASTNAME=
ADMIN_PASSWORD=

MAILER_USER=
MAILER_USERNAME=
MAILER_PASSWORD=
MAILER_HOST=
MAILER_PORT=

VERIFICATION_LINK=

SG=

```

# Dockerfile
```docker

FROM node:18-alpine

WORKDIR /app

COPY package.json yarn.lock ./

COPY tsconfig.build.json tsconfig.build.json
COPY tsconfig.json tsconfig.json

COPY ./src ./src

ENV PORT=
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
ENV SG=7

RUN yarn install \
    && yarn build

EXPOSE 5555

CMD ["node", "dist/app.js"]

```

# Build
```cmd

docker build -t schedule .

```
