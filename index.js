const express = require("express");
const mysql = require('mysql2');
const app = express();
const port = 3000;
// 시퀄라이즈
const config = require('./config/config');
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(config.development);
/// 모델 불러오기
const cntntInf = require('./models/xr_cntnt_inf');
const RS = require('./models/xr_cntnt_rs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//aws 연동
const { S3Client, GetObjectCommand, ListObjectsV2Command} = require('@aws-sdk/client-s3');
const { createReadStream, createWriteStream } = require('fs');

const s3Client = new S3Client(config.aws);
const bucketName = 'airpass';
const prefix = 'uploads/contents/AL.10.Demo/Release';

// S3에서 파일 목록 조회 함수
async function listS3Files(bucketName, prefix = '') {
    const listObjectsCommand = new ListObjectsV2Command({
        Bucket: bucketName,
        Prefix: prefix
    });

    try {
        const { Contents } = await s3Client.send(listObjectsCommand);

        // Check if Contents is defined and is an array
        if (Contents && Array.isArray(Contents)) {
            // 파일 목록 출력
            Contents.forEach((object) => {
                console.log('파일 이름:', object.Key);
                console.log('파일 크기:', object.Size, '바이트');
                console.log('---');
            });

            return Contents; // 필요에 따라 파일 목록을 반환할 수 있습니다.
        } else {
            console.log('파일 목록이 없습니다.');
            return [];
        }
    } catch (err) {
        console.error('파일 목록 조회 중 오류:', err);
        throw err;
    }
}

listS3Files(bucketName, prefix)
    .then((fileList) => console.log('파일 목록 조회 완료:', fileList))
    .catch((err) => console.error('파일 목록 조회 중 오류:', err));



// 특정 컨텐츠 조회 with XR_CNTNT_RS
app.get('/api/getContInfo/:idx', async (req, res) => {
    try {
        const idx = (req.params.idx)? req.params.idx : 134;
        const contInfo = await cntntInf.findOne({
            where:{
                CNTI_IDX: idx,
            },
            include: [  // 모델 관계 설정한 데이터 같이 가져오기
                {
                    model: RS,
                    as:'rs' // 배열 키값
                },
            ],
        });
        res.json(contInfo);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// 포트 연결 확인
app.listen(port, () =>
    console.log(`Example app listening at http://localhost:${port}`)
);