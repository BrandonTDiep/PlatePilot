# Uses node version 22 as our base image
FROM node:22

# Goes to the app directory (think of it like a cd terminal command)
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package.json package-lock.json ./
COPY prisma ./prisma

# Install app dependencies
RUN npm install

# Copy the rest of our app into the container
COPY . .

# Expose the port the application will listen on
EXPOSE 3000

# Define the command to run when the container starts
CMD ["npm", "run", "dev"]