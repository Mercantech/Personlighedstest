# Vite SPA → nginx. /api proxied to internal api:3001
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY index.html ./
COPY public ./public
COPY src ./src
COPY vite.config.mjs ./
ARG VITE_API_BASE_URL=/api
ARG VITE_AUTH_CLIENT_ID=samspil
ARG VITE_ADMIN_ROLES=admin
ARG VITE_ADMIN_ALLOWLIST=
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL \
    VITE_AUTH_CLIENT_ID=$VITE_AUTH_CLIENT_ID \
    VITE_ADMIN_ROLES=$VITE_ADMIN_ROLES \
    VITE_ADMIN_ALLOWLIST=$VITE_ADMIN_ALLOWLIST
RUN npx vite build

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/client /usr/share/nginx/html
EXPOSE 3000
HEALTHCHECK --interval=10s --timeout=5s --start-period=10s --retries=5 \
  CMD wget -qO- http://127.0.0.1:3000/ || exit 1
CMD ["nginx", "-g", "daemon off;"]
