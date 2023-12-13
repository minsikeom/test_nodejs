# Base 이미지를 nodeJS alpine 버전으로 사용
FROM node:alpine

# 작업 디렉토리 전환
WORKDIR /app

# local 컴터에있는  package.json 파일을 현재 워킹 디렉토리에 복사
COPY package*.json ./

# local machine 에서 npm install 실행
RUN npm install --silent
RUN npm install express
RUN npm install -D nodemon
RUN npm install mysql2
RUN npm install dotenv
RUN npm install mysql2 sequelize sequelize-cli
RUN sequelize init
RUN npm install @aws-sdk/client-s3
RUN npm install ejs

# 코드 복사
COPY . .

# 소스 수정시 바로 반영
ENV CHOKIDAR_USEPOLLING=true

# 어플리케이션 구동
CMD ["npm", "start"]
EXPOSE 3000