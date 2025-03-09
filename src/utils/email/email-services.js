import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER, // Sender's email address
        pass: process.env.EMAIL_PASS, // Sender's email password
    },
});

// Generalized email-sending function
export const sendEmail = async ({
                                    to = [],
                                    subject = "route",
                                    bcc = [],
                                    cc = [],
                                    text = "",
                                    html = "",
                                    attachments = []
                                }) => {
    try {
        const info = await transporter.sendMail({
            from: ` " karim " <${process.env.EMAIL_USER}>`, // Sender's name and email
            to, // Recipient(s)
            subject, // Email subject
            bcc, // Blind carbon copy
            cc, // Carbon copy
            text, // Plain text content
            html, // HTML content
            attachments, // Email attachments
        });

        console.log("Message sent: %s", info.messageId);
        return info; // Return the info object for further use
    } catch (error) {
        console.error("Error sending email:", error);
        throw error; // Re-throw the error for handling elsewhere
    }
};

// Function to send OTP email
export const sendOTPEmail = async (email, otp) => {
    try {
        await sendEmail({
            to: [email], // Recipient's email address
            subject: "OTP for Email Verification", // Email subject
            text: `Your OTP is: ${otp}. It will expire in 10 minutes.`, // Plain text content
            html: `<p>Your OTP is: <strong>${otp}</strong>. It will expire in 10 minutes.</p>`, // HTML content (optional)
        });
        console.log("OTP email sent successfully");
    } catch (error) {
        console.error("Failed to send OTP email:", error);
    }
};