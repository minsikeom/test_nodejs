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
// 뷰 페이지 랜더링
const path = require('path');
const ejs = require('ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

///////////////////////////////////aws 연동 셋팅 ///////////////////////////////////////////////////////////////
const { S3Client, GetObjectCommand, ListObjectsV2Command} = require('@aws-sdk/client-s3');
const { createReadStream, createWriteStream } = require('fs');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner')
const s3Client = new S3Client(config.aws);
const bucketName = 'airpass';
const prefix = 'uploads/contents/AL.10.Demo/Release';
const key = 'uploads/contents/AL.10.Demo/Release/AL.10.Demo.zip';

///////////////////////////////S3에서 파일 목록 조회 함수 //////////////////////////////////////////////////////////
async function listS3Files(bucketName, prefix = '') {
    const listObjectsCommand = new ListObjectsV2Command({
        Bucket: bucketName,
        Prefix: prefix
    });

        const { Contents } = await s3Client.send(listObjectsCommand);

        // Check if Contents is defined and is an array
        if (Contents && Array.isArray(Contents)) {
            // 파일 목록 출력
            Contents.forEach((object) => {
                // console.log('파일 이름:', object.Key);
                // console.log('파일 크기:', object.Size, '바이트');
                // console.log('---');
            });

            return Contents; // 필요에 따라 파일 목록을 반환할 수 있습니다.
        } else {
            console.log('파일 목록이 없습니다.');
            return [];
        }
}

//listS3Files(bucketName, prefix)
//    .then((fileList) => console.log('파일 목록 조회 완료:', fileList))
//    .catch((err) => console.error('파일 목록 조회 중 오류:', err));
/////////////////////////////////////////////////////////////////////////////////////////////////////////


//////////////////////////// 파일 다운로드 임시 url 발급 ///////////////////////////////////////////////////
async function generatePresignedUrl(bucketName, key) {

    // Create a command to get the object
    const getObjectCommand = new GetObjectCommand({
        Bucket: bucketName,
        Key: key,
    });

    try {
        // Generate a pre-signed URL that allows access to the object for a specific duration
        const signedUrl = await getSignedUrl(s3Client, getObjectCommand, {
            expiresIn: 60 * 60, // URL expiration time in seconds (1 hour in this example)
        });
        console.log('Pre-signed URL for downloading:', signedUrl);
    } catch (error) {
        console.error('Error generating pre-signed URL:', error);
    }
}
// console.log('파일 다운로드 임시 url 발급')
// // generatePresignedUrl(bucketName,key);

/////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////API 작업 with 시퀄라이즈(ORM) ///////////////////////////////////////////////////////

// 콘텐츠 리스트 전체 with XR_CNTNT_RS
app.get('/api/getContList', async (req, res) => {
    try {
        const contList = await cntntInf.findAll({
            where:{
                CNTI_USE: 'Y',
            },
            include: [  // 모델 관계 설정한 데이터 같이 가져오기
                {
                    model: RS,
                    as:'rs' // 배열 키값
                },
            ],
        });
        res.json(contList);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// 특정 컨텐츠 조회 with XR_CNTNT_RS
app.get('/api/getContInfo/:idx', async (req, res) => {
        try {
            const idx = (req.params.idx) ? req.params.idx : 134;
            const contInfo = await cntntInf.findOne({
                where: {
                    CNTI_IDX: idx,
                },
                include: [  // 모델 관계 설정한 데이터 같이 가져오기
                    {
                        model: RS,
                        as: 'rs' // 배열 키값
                    },
                ],
            });
           // res.json(contInfo);
            res.render('index', { data:contInfo.toJSON() });
        } catch (error) {
            console.error('Error fetching users:', error);
            res.status(500).json({error: 'Internal Server Error'});
        }
});

// 콘텐츠 저장 POST 방식으로 데이터 받아서 해야하나 임시로 get
app.get('/api/insertCont',async (req, res) => {
        try {
            // 테스트 내역 저장
            const newCont = await cntntInf.create({
                CNTI_CODE: 'XR.10.testesttest11',
                CNTT_CODE: 'XR',
                CNTC_CODE: '30',
                SS_CODE: '22',
                CRT_CODE: 20,
                CNTI_REQUIRE_SENSOR: '00,10',
                CNTI_NAME: '2222222',
                CNTI_E_NAME: '2222222',
                CNTI_VERSION: '1.1',
                CNTI_F_NAME: '2222222',
                CNTI_F_ID: '2222222',
                CNTI_F_PATH: '/uploads/contents/XR.10.testtesttest',
                CNTI_MIN_UCNT: 1,
                CNTI_MAX_UCNT: 2,
                CNTI_DESC: '인설트 테스트',
                CNTI_SORT: 161,
                CNTI_SORTBY: 'DESC',
            });
            await newCont.commit();
        } catch (error) {
            await newCont.rollback();
            console.error('Error fetching users:', error);
            res.status(500).json({error: 'Internal Server Error'});
        }
});

// 데이터 업데이트 POST 로 해야하나 get 으로 임시
app.get('/api/updateCont/:idx',async (req, res) => {
        try {
            const idx = (req.params.idx) ? req.params.idx : 134;
            const contInfo = await cntntInf.findOne({
                where: {
                    CNTI_IDX: idx,
                },
            });
            if (contInfo) {
                contInfo.CNTI_NAME = '1515151';
                await contInfo.save();
            }
            await contInfo.commit();
        } catch (error) {
            await contInfo.rollback();
            console.error('Error fetching users:', error);
            res.status(500).json({error: 'Internal Server Error'});
        }
});


// 데이터 삭제 post로 해야하나 get 으로 임시
app.get('/api/deleteCont/:idx',async (req, res) => {
        try {
            const idx = (req.params.idx) ? req.params.idx : 134;
            const contInfo = await cntntInf.findOne({
                where: {
                    CNTI_IDX: idx,
                },
            });
            if (contInfo) {
                await contInfo.destroy();
            }
            await contInfo.commit();
        } catch (error) {
            await contInfo.rollback();
            console.error('Error fetching users:', error);
            res.status(500).json({error: 'Internal Server Error'});
        }

});

app.post('/submit', (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const nickName = req.body.nickName;
    // 여기서 데이터를 저장하거나 다른 처리를 수행할 수 있습니다.
    // get 방식 req.query.{param}  url에서 변수를 받아서 치환은 요렇게
    // post 방식 req.body.{param}  변수 치환은 이렇게
    console.log('사용자 이름:', username);
    console.log('이메일:', email);
    // 다음 페이지로 리다이렉트 또는 응답을 보낼 수 있습니다.
    res.send(username+'//'+email+'//'+nickName+'폼 데이터가 성공적으로 전송되었습니다.');
});


//////////////////////////////////////////////////////////////////////////////////////////////////////////////


///// 뷰 페이지 렌더링 /////////////////////////////////////////////////////////////////////////////////////
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/page', (req, res) => {
    res.render('index', { title: 'Express 웹 페이지', message: '안녕하세요!' });
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////



// 포트 연결 확인
app.listen(port, () =>
    console.log(`Example app listening at http://localhost:${port}`)
);