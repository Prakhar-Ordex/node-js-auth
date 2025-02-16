import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = 'your-secure-key';

export const decryptData = (encryptedText) => {
    try {
        if (!encryptedText) return null;

        // Decode the encrypted text
        const decodedText = decodeURIComponent(encryptedText);
        const bytes = CryptoJS.AES.decrypt(decodedText, ENCRYPTION_KEY);
        const decryptedString = bytes.toString(CryptoJS.enc.Utf8);

        if (!decryptedString) throw new Error('Invalid decryption result');

        return JSON.parse(decryptedString);
    } catch (error) {
        console.error('Decryption error:', error);
        return null;
    }
};

export const encryptData = (data) => {
    try {
        // Encrypt the data
        const encryptedData = CryptoJS.AES.encrypt(
            JSON.stringify(data), 
            ENCRYPTION_KEY
        ).toString();
        
        return encodeURIComponent(encryptedData); // Encode to make it URL-safe
    } catch (error) {
        console.error('Encryption error:', error);
        return null;
    }
};