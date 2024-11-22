FROM node:20.14

WORKDIR /app

COPY package.json .
COPY . .

RUN npm install
RUN npx prisma migrate dev --name init

COPY . .

EXPOSE 3000

CMD ["npm", "start"]