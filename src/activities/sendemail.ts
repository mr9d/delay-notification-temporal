import { send } from '../services/sendgrid';

/**
 * Sends an email to the customer with a delivery update.
 *
 * @param email - The recipient's email address
 * @param text - The email message content
 * @returns True if the email was sent successfully, otherwise false
 */
export async function sendEmail(email: string, text: string): Promise<boolean> {
  // Use the send function from the SendGrid service to send the email.
  return await send(email, 'Delivery Update', text);
}
