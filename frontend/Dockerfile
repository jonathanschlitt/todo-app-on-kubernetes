# pull official base image
FROM node:16.0.0-alpine

# set working directory
WORKDIR /frontend

# add app
COPY . .

# install dependencies and create production build
RUN npm install
# RUN npm run build

# expose port
EXPOSE 8888

ARG VERSION
ENV VERSION=$VERSION

# start app
# CMD ["npm", "run", "start-production"]
CMD ["npm", "run", "start"]

