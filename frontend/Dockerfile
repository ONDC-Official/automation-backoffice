FROM node:18 AS build
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build
RUN mkdir dist/backoffice-frontend

RUN mv dist/assets dist/backoffice-frontend/assets
FROM node:18-slim
WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/dist /app/dist
EXPOSE 5001
CMD ["serve", "-s", "dist", "-l", "5001"]
