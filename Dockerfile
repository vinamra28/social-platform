FROM node:12

# ARG define a new build time argument with a default value
ARG PORT=5000
# ENV define an environment variable for the container
# Using ARG in ENV create the possibility to pass an env at build or run time
ENV PORT=${PORT}

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# TODO: add DB uri in the future

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE ${PORT}

CMD [ "npm", "start" ]