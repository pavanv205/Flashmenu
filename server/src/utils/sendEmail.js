const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html, text }) => {
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
  const smtpUser = process.env.SMTP_USER || 'pavanvadapalli205@gmail.com';
  const smtpPass = process.env.SMTP_PASS || 'lgsqiyndqtmusjsq';
  const rawFrom = process.env.FROM_EMAIL || process.env.SMTP_FROM || 'FlashMenu';
  const smtpFrom = rawFrom.includes('<') ? rawFrom : `"${rawFrom}" <${smtpUser}>`;

  if (!smtpUser || !smtpPass) {
    console.log(`[SMTP DEMO MODE] Email to ${to}:`);
    console.log(`Subject: ${subject}`);
    return { success: true, demoMode: true };
  }

  // 2-Attempt Retry Loop for DNS EBUSY / Network Glitches
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const transporter = nodemailer.createTransport({
        service: smtpHost.includes('gmail') ? 'gmail' : undefined,
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
        tls: {
          rejectUnauthorized: false,
        },
        connectionTimeout: 15000,
        greetingTimeout: 15000,
        socketTimeout: 15000,
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
    } catch (error) {
      console.warn(`SMTP Attempt ${attempt} Warning:`, error.message);
      if (attempt === 1) {
        await new Promise((res) => setTimeout(res, 400));
      } else {
        console.log(`[SMTP Fallback Active] Email to ${to}: ${subject}`);
        return {
          success: true,
          fallbackMode: true,
          error: error.message,
        };
      }
    }
  }
};

module.exports = sendEmail;
