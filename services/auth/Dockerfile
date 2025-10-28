# Build stage
FROM node:20-alpine AS build
WORKDIR /app

# install pnpm
RUN npm install -g pnpm

# copy package manifests first for cached install
COPY package.json pnpm-lock.yaml* ./
# install deps
RUN pnpm install --frozen-lockfile

# copy sources and build
COPY . .
RUN pnpm run build

# Runtime stage
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

# install pnpm to use pnpm dlx or future needs (optional)
RUN npm install -g pnpm

# copy only built artifacts and package.json (to know deps if needed)
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY package.json ./

# copy seed data files for database initialization
COPY --from=build /app/seed-*.json ./
COPY --from=build /app/seed-all-data.js ./
COPY --from=build /app/seed-traceability-events.js ./

EXPOSE 4000
CMD ["node", "dist/index.js"]
