FROM node:20.14

WORKDIR /app

COPY . .

RUN rm -rf .node_modules
RUN npm install
RUN npx prisma migrate dev --name init

COPY . .

EXPOSE 3000

CMD ["npm", "start"]