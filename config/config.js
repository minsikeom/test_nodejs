module.exports = {
    development: {
        username: 'tester',
        password: 'password1!',
        database: 'testdb',
        host: 'laradock-mysql-1',
        dialect: 'mysql', // Change this based on your database type
    },
    production: {
        username: "webmas",
        password: "!airpass29",
        database: "XRSPORTS",
        host: "xrplatform.kr",
        dialect: "mysql"
    },
    aws :{
        region: 'kr-standard', // S3 bucket이 위치한 지역
        endpoint: 'https://kr.object.ncloudstorage.com', // 엔드포인트 s3아닐때 변경필요
        credentials: {
            accessKeyId: 'HDjF1AEtqGNNEfH82QNV',
            secretAccessKey: 'rcwf09qRpN6d03zyd6ew1ytLNp9eQCPW0pcGC6PF'
        }
    }

    // Add other environments (e.g., production) if needed
};