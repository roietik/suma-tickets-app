FROM node:18.17.1-alpine AS app
WORKDIR /app
COPY ./package.json ./
RUN npm i
COPY . .
RUN npm run build

FROM nginx
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=app /app/dist/browser /usr/share/nginx/html
EXPOSE 3000