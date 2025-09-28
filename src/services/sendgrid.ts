import sgMail from '@sendgrid/mail';

// Set the SendGrid API key from environment variables for authentication.
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);


/**
 * Sends an email using the SendGrid service.
 *
 * @param email - The recipient's email address
 * @param subject - The subject line of the email
 * @param text - The plain text content of the email
 * @returns True if the email was sent successfully
 */
export async function send(email: string, subject: string, text: string): Promise<boolean> {
  // Ensure the API key is set in environment variables.
  if (!process.env.SENDGRID_API_KEY) {
    throw new Error('SENDGRID_API_KEY is not set in environment variables');
  }

  // Construct the email message object with all required fields.
  const msg = {
    to: email,
    from: process.env.SENDGRID_FROM_EMAIL || 'noreply@yourdomain.com',
    subject,
    text,
    mailSettings: {
      sandboxMode: { enable: process.env.SENDGRID_SANDBOX_MODE === 'true' },
    },
  };

  // Send the email using SendGrid's API.
  await sgMail.send(msg);
  return true;
}
