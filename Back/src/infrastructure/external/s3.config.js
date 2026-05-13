const AWS = require('aws-sdk');
const fs = require('fs').promises;
require('dotenv').config();

const BUCKET_NAME = process.env.AWS_BUCKET_NAME || process.env.AWS_BUCKET;

AWS.config.update({
  signatureVersion: 'v4',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3({
  signatureVersion: 'v4',
});

const uploadToS3 = async (filePath, fileName) => {
  // Read the temp file into a Buffer
  //We need to convert it to base64 in order to upload it, fs to process the file

  const data = await fs.readFile (filePath);

  //const base64data = Buffer.from(data, 'binary');

  const params = {
    Bucket: BUCKET_NAME,

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

// Extract images from S3 URLs

function extractObjectKey (imageUrlOrKey) {

  // If it's not a valid string, return null
  if (!imageUrlOrKey || typeof imageUrlOrKey !== 'string') return null;

  // If it doesn't look like a URL, treat it as a direct key
  if (!imageUrlOrKey.startsWith('http')) {
    return imageUrlOrKey.replace(/^\/+/, '');
  }

  // Parse the URL and extract the path as the key
  const url = new URL(imageUrlOrKey);
  let key = url.pathname.startsWith('/') ? url.pathname.slice(1) : url.pathname;
  if (BUCKET_NAME && key.startsWith(`${BUCKET_NAME}/`)) {
    key = key.slice(BUCKET_NAME.length + 1);
  }

  return decodeURIComponent(key);
}

// Generate a pre-signed URL for accessing an S3 object

async function getPresignedUrl (imageUrlOrKey, expiresIn = 3600) {
  if (!imageUrlOrKey) return null;
  if (!BUCKET_NAME) throw new Error('Missing AWS bucket configuration');

  // If the input already looks like a pre-signed URL, return it as is
  if (typeof imageUrlOrKey === 'string' && imageUrlOrKey.includes('X-Amz-Signature=')) {
    return imageUrlOrKey;
  }

  const key = extractObjectKey(imageUrlOrKey);
  if (!key) return null;

  const params = {
    Bucket: BUCKET_NAME,
    Key: key,
    Expires: Number(expiresIn),
  };

  if (typeof s3.getSignedUrlPromise === 'function') {
    return s3.getSignedUrlPromise('getObject', params);
  }

  return new Promise((resolve, reject) => {
    s3.getSignedUrl('getObject', params, (error, signedUrl) => {
      if (error) return reject(error);
      return resolve(signedUrl);
    });
  });
}

// Delete an object from S3 (by URL or key)
async function deleteFromS3 (imageUrlOrKey) {
  if (!imageUrlOrKey) return false;
  if (!BUCKET_NAME) return false;

  const key = extractObjectKey(imageUrlOrKey);
  if (!key) return false;

  try {
    await s3.deleteObject({
      Bucket: BUCKET_NAME,
      Key: key,
    }).promise();

    // eslint-disable-next-line no-console
    console.log(`S3 object deleted: ${key}`);
    return true;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`Error deleting S3 object (${key}):`, err.message);
    
    return false;
  }
}

module.exports = { s3, uploadToS3, getPresignedUrl, deleteFromS3 };

