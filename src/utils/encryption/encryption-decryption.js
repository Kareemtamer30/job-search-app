import crypto from "crypto";

const algorithm = "aes-256-cbc";
const key = crypto.randomBytes(32); // Use a secure key (store in .env)
const iv = crypto.randomBytes(16); // Initialization vector

// Encrypt mobile number
export const encrypt = (text) => {
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
};

// Decrypt mobile number
export const decrypt = (text) => {
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
    let decrypted = decipher.update(text, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
};