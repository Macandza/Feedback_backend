FROM node:lts-alpine

EXPOSE 1286

WORKDIR /app

COPY . .

RUN npm config set unsafe-perm true

RUN npm install mysql

RUN npm install
	

CMD ["npm", "start"]

