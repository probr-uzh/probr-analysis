# Pull base image
FROM digitallyseamless/nodejs-bower-grunt:0.12

# Define working directory
RUN mkdir /app
WORKDIR /app

# npm install
ADD package.json /app/package.json
RUN npm install

# bower install
ADD bower.json /app/bower.json
RUN bower install --allow-root

# add application code
ADD . /app/

# build it
RUN grunt build --force

# Define default command
CMD ["npm", "start"]