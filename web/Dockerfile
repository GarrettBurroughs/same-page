FROM node:16

WORKDIR /app

COPY package*.json ./ 

RUN npm install -g serve 

RUN npm install 

COPY . . 

RUN npm run build

CMD ["serve", "-l", "8080", "-s", "build"]