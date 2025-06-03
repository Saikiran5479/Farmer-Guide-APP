// File: backend/utils/sendSMS.js
const twilio = require("twilio");
require("dotenv").config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

async function sendSMS(to, message) {
    try {
        const response = await client.messages.create({
            body: message,
            from: twilioPhone,
            to: `+91${to}` // change +91 if outside India
        });
        console.log("SMS sent:", response.sid);
    } catch (err) {
        console.error("SMS sending failed:", err);
        throw err;
    }
}

module.exports = sendSMS;
