# Use Node.js base image
FROM node:18

# Create app directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the server code
COPY . .

# Expose the port your server uses
EXPOSE 3000

# Run the server
CMD ["node", "app.js"]
