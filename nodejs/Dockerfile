FROM node:20-alpine
WORKDIR /app
COPY nodejs/index.js .
EXPOSE 3003
ENV SECRETS='{"mysupersecretkey":"123123123"}'
CMD ["node", "/app/nodejs/index.js"]