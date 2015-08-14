# Pull base image
FROM digitallyseamless/nodejs-bower-grunt:0.12

# Define working directory
RUN mkdir /app
WORKDIR /app

# npm install
COPY package.json /app/package.json
RUN npm install

# bower install
COPY .bowerrc /app/.bowerrc
COPY bower.json /app/bower.json
RUN bower install --allow-root

# add application code
COPY . /app/

# build it
RUN NODE_ENV=production grunt build --force

# Define default command
CMD ["npm", "start"]