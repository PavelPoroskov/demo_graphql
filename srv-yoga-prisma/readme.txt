

yarn global add prisma

sudo docker-compose up -d

//only first time
cd database
prisma deploy
(choose local ...)

cd ..
yarn start 
(or "npm start")