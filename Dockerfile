FROM node:20.3.0

RUN mkdir /app
WORKDIR /app

# Install bun
RUN curl -fsSL https://bun.sh/install | bash
RUN cp /root/.bun/bin/bun /usr/local/bin

COPY package.json ./
COPY bun.lock* ./
COPY bunfig.toml ./

ARG HUBELIA_PACKAGE_TOKEN
ENV HUBELIA_PACKAGE_TOKEN=$HUBELIA_PACKAGE_TOKEN

RUN bun install --frozen-lockfile

COPY . .

ENV NODE_ENV production
ENV PORT 3000
EXPOSE $PORT

RUN bun run build
ENV NODE_OPTIONS='--import /app/src/public/instrument.server.mjs'

CMD ["bun", ".output/server/index.mjs"]