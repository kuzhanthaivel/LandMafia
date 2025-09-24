FROM node:20

WORKDIR /client

COPY . .

RUN npm install

EXPOSE 3000

ENV NEXT_PUBLIC_ADMIN=0x11a6284488460896fa03153Ede0a32b2E1708100 
ENV MONGO_URL=mongodb+srv://kuzhanthai:admin@cluster0.osfcd.mongodb.net/landMafia
ENV JWT_SECRET=your_jwt_secret_key

CMD ["npm", "run", "dev"]