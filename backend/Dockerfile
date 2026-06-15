FROM node:20-slim

ENV PRISMA_ENGINES_MIRROR=https://registry.npmmirror.com/-/binary/prisma

RUN apt-get update && apt-get install -y wget openssl ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY prisma ./prisma/
RUN npx prisma generate || echo "Prisma generate deferred to runtime"

COPY . .

EXPOSE 4000

COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN sed -i 's/\r$//' /docker-entrypoint.sh && chmod +x /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]
