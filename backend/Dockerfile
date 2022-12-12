
# pull official base image
FROM node:16.0.0-alpine

# set working directory
WORKDIR /backend

# add app
COPY . .

# install dependencies and create production build
RUN npm install

# expose port
EXPOSE 7777

# start app
CMD ["npm", "start"]

