# Use Node.js base image
FROM node:18

# Create app directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the client code
COPY . .

# Expose Vite's default port
EXPOSE 5173

# Run Vite dev server with network visibility
CMD ["npm", "run", "dev", "--", "--host"]
