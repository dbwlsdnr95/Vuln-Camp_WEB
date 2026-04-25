FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

EXPOSE 3001

CMD ["npx", "next", "dev", "-H", "0.0.0.0", "-p", "3001", "--webpack"]
