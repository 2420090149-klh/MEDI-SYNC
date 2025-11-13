FROM node:18-slim

WORKDIR /usr/src/app

# Install production dependencies only
COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 4000

CMD [ "node", "index.js" ]
