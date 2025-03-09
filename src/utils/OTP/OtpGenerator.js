import { customAlphabet } from "nanoid";
import bcrypt from "bcrypt";

// Define a custom alphabet with numbers from 1 to 9
const alphabet = "123456789";
const generateOTP = customAlphabet(alphabet, 4); // Generate a 4-digit OTP

// Hash the OTP
export const hashOTP = async (otp) => {
    return await bcrypt.hash(otp, 8);
};

// Export the OTP generator
export { generateOTP };