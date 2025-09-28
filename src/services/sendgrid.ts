import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function send(email: string, subject: string, text: string): Promise<boolean> {
  const msg = {
    to: email,
    from: 'noreply@yourdomain.com',
    subject,
    text,
    mailSettings: {
      sandboxMode: { enable: true }, // Debug mode - no actual email will be sent
    },
  };

  await sgMail.send(msg);
  return true;
}
