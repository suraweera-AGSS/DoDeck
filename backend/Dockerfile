# Use an official Node.js image as the base
FROM node:18

# Set working directory
WORKDIR /app

# Copy only package.json and package-lock.json first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all project files
COPY . .

# Expose your backend port (5000)
EXPOSE 5000

# Start your app with "npm run server"
CMD ["npm", "run", "server"]
