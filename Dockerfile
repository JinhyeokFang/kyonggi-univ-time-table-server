FROM node:22.13.1 as builder

WORKDIR /app

COPY . .

RUN npm install && npm run build

CMD ["sh", "-c", "node ./dist/main.js"]
