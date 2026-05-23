FROM node:18-alpine

WORKDIR /app

# Step to upgrade installed OS packages to safe patches
RUN apk update && apk upgrade --no-cache

COPY package*.json ./
RUN npm install --only=production

COPY . .

EXPOSE 3000
CMD ["node", "app.js"]