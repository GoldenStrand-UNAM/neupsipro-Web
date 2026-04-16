const AWS = require('aws-sdk');
const fs = require('fs').promises;
require('dotenv').config();
//env
// AWS credentials

AWS.config.update({
  signatureVersion: '',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

const uploadToS3 = async (filePath, fileName) => {
    // Read the temp file into a Buffer
    //We need to convert it to base64 in order to upload it, fs to process the file

    // const data = await fs.readFile (filePath);

    //const base64data = Buffer.from(data, 'binary');

    const params = {
        //bucket name  
        Bucket: 's3-neupsi-golden-unam-preprod-1',

        //The key is the file name
        Key: `forum/${fileName}`,

        //our buffer in base64
        Body: data,
      };
  
    //upload to the bucket S3 and we will do this with the SDK call
    /* The SDK call uses the upload method where the params package is received, 
      and if everything is configured correctly, it should work automatically.*/
    const result = await s3.upload(params).promise();

    //eslint-disable-next-line no-console
    console.log(`File uploaded successfully at ${result.Location}`);

    //  Delete the local temp file
    await fs.unlink(filePath);

    // Return the public S3 URL
    return result.Location;
};

async function getPresignedUrl(imageUrlOrKey, expiresIn = 3600) {
    if (!imageUrlOrKey) return null;

    // If the input is a full URL, extract the key
    let key = imageUrlOrKey;
    if (imageUrlOrKey.startsWith('http')) {
        const url = new URL(imageUrlOrKey);
        key = url.pathname.startsWith('/') ? url.pathname.slice(1) : url.pathname;
    }
    
    const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
    });

    return await getSignedUrl(s3Client, command, { expiresIn });
}


module.exports = { s3, uploadToS3, getPresignedUrl };