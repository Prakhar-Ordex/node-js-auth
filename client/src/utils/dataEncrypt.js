import CryptoJS from 'crypto-js';
export const decryptQueryParams = (encryptedText) => {
    try {
        if (!encryptedText) return null;

        // Decode the encrypted text
        const decodedText = decodeURIComponent(encryptedText);
        const bytes = CryptoJS.AES.decrypt(decodedText, "abcd");
        const decryptedString = bytes.toString(CryptoJS.enc.Utf8);

        if (!decryptedString) throw new Error('Invalid decryption result');

        const decryptedData = JSON.parse(decryptedString);

        // Validate timestamp (24 hours)
        const timestamp = new Date(decryptedData.timestamp);
        const now = new Date();
        const validityPeriod = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

        if (now - timestamp > validityPeriod) {
            console.warn('Decryption failed: Link expired');
            return null;
        }

        return decryptedData;
    } catch (error) {
        console.error('Decryption error:', error);
        return null;
    }
};

export const generateEncryptedParams = (title, type) => {
    try {
        const data = {
            title,
            type,
            timestamp: new Date().toISOString(),
        };

        // Encrypt the data
        const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), "abcd").toString();
        return encodeURIComponent(encryptedData); // Encode to make it URL-safe
    } catch (error) {
        console.error('Encryption error:', error);
        return null;
    }
};