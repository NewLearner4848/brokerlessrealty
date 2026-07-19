
const nodemailer = require('nodemailer');
const SettingsModel = require('../models/settings.model');

async function getTransporter() {
    const dbSettings = await SettingsModel.getSettings();

    const settings = {
      host: dbSettings.smtp_host || process.env.SMTP_HOST,
      port: dbSettings.smtp_port || process.env.SMTP_PORT,
      user: dbSettings.smtp_user || process.env.SMTP_USER,
      pass: dbSettings.smtp_pass || process.env.SMTP_PASS,
      receiver: dbSettings.receiver_email || process.env.RECEIVER_EMAIL,
    };

    if (!settings.host || !settings.user || !settings.pass || !settings.receiver) {
      console.error('Email settings are incomplete. Cannot send email.');
      return null;
    }

    const transporter = nodemailer.createTransport({
      host: settings.host,
      port: parseInt(settings.port, 10) || 587,
      secure: (parseInt(settings.port, 10) === 465),
      auth: {
        user: settings.user,
        pass: settings.pass,
      },
    });

    return { transporter, settings };
}

/**
 * Sends a notification email for a new contact form submission.
 * @param {object} contact - The contact details object from the database.
 */
const sendContactNotification = async (contact) => {
  try {
    const mailer = await getTransporter();
    if (!mailer) return;

    const { transporter, settings } = mailer;

    let messageContent = `<p><strong>Message:</strong></p><p>${contact.message.replace(/\n/g, '<br>')}</p>`;
    try {
        const parsedMessage = JSON.parse(contact.message);
        if (typeof parsedMessage === 'object' && parsedMessage !== null) {
            messageContent = `<ul>`;
            if (parsedMessage.inquiryType) {
                messageContent += `<li><strong>Inquiry Type:</strong> ${parsedMessage.inquiryType}</li>`;
            }
            if (parsedMessage.property) {
                messageContent += `<li><strong>Property:</strong> ${parsedMessage.property}</li>`;
            }
            // Handling both budget (rent) and expectedPrice (sell)
            if (parsedMessage.budget || parsedMessage.expectedPrice) {
                messageContent += `<li><strong>Budget/Price:</strong> ${parsedMessage.budget || parsedMessage.expectedPrice}</li>`;
            }
            // Handling both location (rent) and propertyLocation (sell)
             if (parsedMessage.location || parsedMessage.propertyLocation) {
                messageContent += `<li><strong>Location:</strong> ${parsedMessage.location || parsedMessage.propertyLocation}</li>`;
            }
            messageContent += `</ul><p><strong>Message:</strong></p><p>${(parsedMessage.userMessage || '').replace(/\n/g, '<br>')}</p>`;
        }
    } catch (e) {
        // Not JSON, or malformed. Keep original message content.
    }

    const mailOptions = {
      from: `"Brokerless Realty" <${settings.user}>`,
      to: settings.receiver,
      subject: 'New Contact Form Submission',
      html: `
        <p>You have received a new message from the contact form:</p>
        <ul>
          <li><strong>Name:</strong> ${contact.name}</li>
          <li><strong>Email:</strong> ${contact.email}</li>
          ${contact.phone ? `<li><strong>Phone:</strong> ${contact.phone}</li>` : ''}
        </ul>
        <hr>
        ${messageContent}
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Contact notification email sent successfully to ${settings.receiver}`);
  } catch (error) {
    console.error('Error sending contact notification email:', error);
  }
};

/**
 * Sends a notification email for a new rent inquiry.
 * @param {object} inquiry - The rent inquiry details.
 */
const sendRentInquiryNotification = async (inquiry) => {
    try {
        const mailer = await getTransporter();
        if (!mailer) return;

        const { transporter, settings } = mailer;

        let detailsHtml = ``;
        if (inquiry.userType === 'owner') {
            detailsHtml = `
                <h4>Property Owner Details:</h4>
                <ul>
                    <li><strong>Expected Rent:</strong> ${inquiry.budget}</li>
                    <li><strong>Property Type:</strong> ${inquiry.propertyType}</li>
                    <li><strong>Property Address:</strong> ${inquiry.propertyAddress}</li>
                    <li><strong>Area (sqft):</strong> ${inquiry.areaSqft}</li>
                    <li><strong>Furnishing Status:</strong> ${inquiry.furnishingStatus}</li>
                    <li><strong>Available From:</strong> ${inquiry.availableFrom}</li>
                </ul>
            `;
        } else { // tenant
            detailsHtml = `
                <h4>Tenant Details:</h4>
                <ul>
                    <li><strong>Budget Range:</strong> ${inquiry.budget}</li>
                    <li><strong>Configuration:</strong> ${inquiry.configuration}</li>
                    <li><strong>Furnishing Preference:</strong> ${inquiry.furnishingPreference}</li>
                </ul>
            `;
        }

        const mailOptions = {
            from: `"Brokerless Realty" <${settings.user}>`,
            to: settings.receiver,
            subject: `New Rent Inquiry: ${inquiry.userType === 'owner' ? 'Property Owner' : 'Potential Tenant'}`,
            html: `
                <p>You have received a new rent inquiry.</p>
                <h4>Common Details:</h4>
                <ul>
                    <li><strong>Name:</strong> ${inquiry.fullName}</li>
                    <li><strong>Mobile:</strong> ${inquiry.mobileNumber}</li>
                    <li><strong>Email:</strong> ${inquiry.email || 'N/A'}</li>
                    <li><strong>Location Preference:</strong> ${inquiry.locationPreference}</li>
                    <li><strong>Timeline:</strong> ${inquiry.timeline}</li>
                </ul>
                <hr>
                ${detailsHtml}
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Rent inquiry notification email sent to ${settings.receiver}`);
    } catch (error) {
        console.error('Error sending rent inquiry notification email:', error);
    }
};
/**
 * Sends a password reset OTP email.
 * @param {string} email - Recipient email.
 * @param {string} otp - One-time password.
 */
const sendResetOTPEmail = async (email, otp) => {
  try {
    const mailer = await getTransporter();
    if (!mailer) {
      console.log(`[Email Service Mock] Could not initialize transporter. Reset OTP for ${email} is: ${otp}`);
      return false;
    }

    const { transporter, settings } = mailer;

    const mailOptions = {
      from: `"Brokerless Realty" <${settings.user}>`,
      to: email,
      subject: 'Admin Password Reset OTP',
      html: `
        <h3>Password Reset Request</h3>
        <p>You have requested to reset your admin password.</p>
        <p>Your One-Time Password (OTP) is: <strong style="font-size: 1.2em; letter-spacing: 2px; color: #4f46e5;">${otp}</strong></p>
        <p>This OTP will expire in 10 minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Password reset OTP sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Error sending reset OTP email:', error);
    return false;
  }
};


module.exports = { 
    sendContactNotification,
    sendRentInquiryNotification,
    sendResetOTPEmail
};

