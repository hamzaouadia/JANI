# Use Node.js 20 Alpine base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

COPY . ./

# Install dependencies

RUN npm install -g npm@11.6.1
# Expose port your app will run on
EXPOSE 3000

# Command to start the development server
CMD ["npm", "run", "dev"]
