require('dotenv').config();
const crypto = require('crypto');

const ALGORITHM = 'aes-256-gcm';
const SECRET_KEY = crypto.scryptSync(process.env.DB_ENCRYPTION_KEY, 'our_salt', 32); 

class crypt {
  encrypt(plainText) {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(ALGORITHM, SECRET_KEY, iv);
    let encrypted = cipher.update(plainText, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const tag = cipher.getAuthTag().toString('hex');
    
    return `${iv.toString('hex')}:${tag}:${encrypted}`;
  }

  decrypt(encryptedString) {
    const [ivHex, tagHex, encriptadoHex] = encryptedString.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const tag = Buffer.from(tagHex, 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, SECRET_KEY, iv);
    decipher.setAuthTag(tag);
    let decrypted = decipher.update(encriptadoHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }
} module.exports = crypt;