// utils/cronJobs.js
import cron from "node-cron";
import { OTPModel } from "../../models/Otp.model.js";

// Function to delete expired OTPs
const deleteExpiredOTPs = async () => {
    try {
        const currentTime = new Date();
        await OTPModel.deleteMany({ expiresIn: { $lt: currentTime } });
        console.log("Expired OTPs deleted successfully");
    } catch (error) {
        console.error("Error deleting expired OTPs:", error);
    }
};

// Schedule the CRON job to run every 6 hours
export const startCronJobs = () => {
    cron.schedule("0 */6 * * *", deleteExpiredOTPs); // Runs every 6 hours

};