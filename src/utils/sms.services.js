const twilio = require('twilio');
const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

/**
 * @function sendSMSOTP
 * @param {string} to 
 * @param {string} otp 
 * @returns {Promise}
 * @description This function sends an SMS with the OTP code to the specified recipient.
 * @example
 * const result = await sendSMSOTP('+237123456789', '123456');
 * console.log(result);
 * @throws {Error} If the SMS fails to send.
 * @throws {Error} If the Twilio client fails to send the SMS.
 */
const sendSMSOTP = async (to, otp) => {
  console.log("OTP SMS Number", to)
  return client.messages.create({
    body: `Votre code OTP est : ${otp}`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: `+${to}`,
  });
};

module.exports = { sendSMSOTP };