FROM node:18-slim
WORKDIR /usr/src/app

# only copy sources at build time (no RUN here)
COPY app/ ./ 

EXPOSE 3000
# real install happens at runtime via docker-compose command
CMD ["node","app.js"]
