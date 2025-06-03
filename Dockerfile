# Stage 1: Build the application
FROM node:20 AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code to the working directory
COPY . .

# Compile TypeScript to JavaScript
RUN npm run build

# Stage 2: Run the application
FROM node:20

# Set the working directory
WORKDIR /app


RUN apt-get update && apt-get install -y smbclient


# Copy only the necessary files from the build stage
COPY --from=build /app/package.json /app/package-lock.json ./
COPY --from=build /app/dist ./dist

# Install only production dependencies
RUN npm ci --only=production

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/main.js"]
