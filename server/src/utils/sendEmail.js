const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
    const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpFrom = process.env.SMTP_FROM || `"FlashMenu Support" <${smtpUser || 'noreply@flashmenu.com'}>`;

    if (smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465, // true for 465, false for other ports
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });

      const info = await transporter.sendMail({
        from: smtpFrom,
        to,
        subject,
        text: text || html.replace(/<[^>]*>?/gm, ''),
        html,
      });

      console.log(`Email sent successfully to ${to} (MessageId: ${info.messageId})`);
      return { success: true, messageId: info.messageId };
    } else {
      console.log(`[SMTP DEMO MODE] Email to ${to}:`);
      console.log(`Subject: ${subject}`);
      console.log(`HTML: ${html}`);
      return { success: true, demoMode: true };
    }
  } catch (error) {
    console.error('SMTP Email Error:', error);
    // Don't crash the server, return failure status
    return { success: false, error: error.message };
  }
};

module.exports = sendEmail;
