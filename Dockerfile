# Stage 1: Build the Angular Application
FROM node:20-alpine AS build
WORKDIR /app

# Accept build configuration as an argument (defaults to production if not provided)
ARG BUILD_CONFIGURATION=production

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy full project source and build with the specified configuration
COPY . .
RUN npx ng build --configuration=${BUILD_CONFIGURATION}

# Stage 2: Serve via Nginx
FROM nginx:alpine

# Copy custom Nginx configuration for Angular routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled Angular distribution files to Nginx web root
COPY --from=build /app/dist/gamana-muttopalvelu-frontend/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]