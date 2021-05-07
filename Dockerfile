ARG NODE_VERSION=12
FROM node:${NODE_VERSION}

# RUN mkdir /app
WORKDIR /app

ENV NODE_ENV production
# ENV PATH /app/node_modules/.bin:$PATH

COPY package.json package-lock.json /app/
RUN npm install --only=production
COPY built built/

CMD [ "npm", "start" ]
