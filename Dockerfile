FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20
WORKDIR /app
RUN apt-get update && apt-get install -y smbclient && apt-get clean && rm -rf /var/lib/apt/lists/*
COPY --from=build /app/package*.json ./
COPY --from=build /app/dist ./dist
COPY --from=build /app/public ./public
RUN npm ci --only=production
EXPOSE 3000
CMD ["node", "dist/main.js"]
