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

module.exports = { s3, uploadToS3 };