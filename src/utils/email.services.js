const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

/**
 * @function sendEmailOTP
 * @param {string} to 
 * @param {string} otp 
 * @param {string} subject 
 * @returns {Promise}
 * @description This function sends an email with the OTP code to the specified recipient.
 * @example
 * const result = await sendEmailOTP('devenv@mail.com', '123456', 'Your OTP code');
 * console.log(result);
 */
const sendEmailOTP = async (to, otp, subject='Votre code OTP pour la réinitialisation du mot de passe') => {
    const mailOptions = {
        from: '"Sentinelle Project" <no-reply@sentinelle.com>',
        to,
        subject: subject,
        text: `Votre code OTP est : ${otp}`,
        html: `<p>Votre code OTP est : <strong>${otp}</strong></p>`,
    };

    return transporter.sendMail(mailOptions);
};

module.exports = { sendEmailOTP };