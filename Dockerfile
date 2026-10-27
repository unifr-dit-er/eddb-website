# Static build served by nginx: no Node.js at run time.
#   podman build -t eddb-website:latest .
FROM docker.io/library/node:22-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Unprivileged image: nginx runs as a regular user and listens on 8080.
# Images are named in full: Podman refuses short names without a TTY.
FROM docker.io/nginxinc/nginx-unprivileged:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 8080
