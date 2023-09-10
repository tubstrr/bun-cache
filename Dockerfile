FROM oven/bun:0.5.9
WORKDIR /app
COPY package.json package.json
COPY bun.lockb bun.lockb


RUN bun install
COPY . .
COPY helpers.js helpers.js
COPY db.js db.js
COPY index.js index.js
EXPOSE 3000
ENTRYPOINT ["bun", "index.js"]