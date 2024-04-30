FROM node:alpine As build
WORKDIR /src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:alpine as production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
EXPOSE 3000
WORKDIR /src/app
COPY package*.json ./
RUN npm install --only=production
COPY . .
COPY --from=build /src/app/dist ./dist
CMD ["node", "dist/apps/api/main"]