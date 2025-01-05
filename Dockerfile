# Step 1: Build NGINX with --with-stream module
FROM izetmolla/nginx-alpine:latest AS nginx








# Step 1.1: Build Vite app using pnpm
FROM node:22-alpine AS vite-build
# Install pnpm
RUN npm install -g pnpm
WORKDIR /vite-app
COPY frontend/pnpm-lock.yaml frontend/package.json ./
RUN pnpm install
COPY frontend ./
RUN pnpm run build



# Step 1.2: Build dependencies for Go app
FROM golang:1.23.4-alpine AS build
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
RUN apk --no-cache add build-base
COPY . ./
RUN rm -rf frontend/build
# Copy Vite app build artifacts
COPY --from=vite-build /vite-app/build frontend/build
RUN CGO_ENABLED=1 CGO_CFLAGS="-D_LARGEFILE64_SOURCE" go build -o /main -ldflags="-w -s" .

 # Step 2: Create a clean Alpine image with only NGINX binary
FROM alpine:latest
LABEL maintainer="Izet Molla <izetmolla@gmail.com>"

# Install necessary runtime dependencies
RUN apk add --no-cache pcre zlib openssl logrotate

# Create nginx user and group
RUN addgroup -S nginx && adduser -S nginx -G nginx
# Ensure correct ownership and permissions
RUN mkdir -p /var/cache/nginx /run/nginx /var/log/nginx \
    && chown -R nginx:nginx /var/cache/nginx /run/nginx /var/log/nginx

# Copy the NGINX binary and configuration from the nginx stage
COPY --from=nginx /etc/nginx /etc/nginx
RUN ln -s /etc/nginx/sbin/nginx /usr/local/bin/nginx


RUN mkdir -p /etc/proxymanager
WORKDIR /etc/proxymanager
COPY --from=build /main proxymanager

RUN chmod +x /etc/proxymanager/proxymanager
RUN ln -s /etc/proxymanager/proxymanager /usr/local/bin/proxymanager

# Add NGINX configuration (optional, you can use your own configuration here)
COPY nginx.conf /etc/nginx/nginx.conf

# Add a startup script
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Expose ports (adjust as needed)
EXPOSE 80 443
# Set the entrypoint to the startup script
ENTRYPOINT ["/start.sh"]