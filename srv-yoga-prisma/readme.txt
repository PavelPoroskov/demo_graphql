

yarn add global prisma

sudo docker-compose up -d

cd database
prisma deploy
(choose local ...)

cd ..
yarn start 
(or "npm start")