# Stage 1: Build the application
FROM oven/bun:latest as build

# Set the working directory inside the container
WORKDIR /app

# Copy the package files
COPY bun.lockb package.json /app/

# Install dependencies
RUN bun install

# Copy the rest of the application source code
COPY . /app

RUN bun run build

# Build your app (Optional: if you have any build process, run it here)
# Example: RUN bun build (if you're compiling TypeScript or similar)
# In most cases, you may not need this for Bun-based apps.

# Stage 2: Run the application in a clean environment
FROM oven/bun:latest

# Set the working directory
WORKDIR /app

# Copy files from the build stage
COPY --from=build /app /app

# Expose the port Bun will be running on
EXPOSE 5174

# Start the application
CMD ["bun", "run", "index.ts"] # Change src/index.ts to your entry point
