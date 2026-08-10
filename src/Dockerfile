# Stage 1: Build the Angular Application
FROM node:20-alpine AS build
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy full project source and build production artifacts
COPY . .
RUN npm run build -- --configuration=production

# Stage 2: Serve via Nginx
FROM nginx:alpine

# Copy custom Nginx configuration for Angular routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled Angular distribution files to Nginx web root
# Note: Adjust 'browser' path if your angular.json outputs directly to dist/<project-name>
COPY --from=build /app/dist/*/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]