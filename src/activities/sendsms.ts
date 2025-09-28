import { send } from '../services/twilio';

/**
 * Sends an SMS to the customer with a delivery update.
 *
 * @param phoneNumber - The recipient's phone number
 * @param text - The SMS message content
 * @returns True if the SMS was sent successfully, otherwise false
 */
export async function sendSms(phoneNumber: string, text: string): Promise<boolean> {
  // Use the send function from the Twilio service to send the SMS.
  return await send(phoneNumber, '+15005550006', text);
}
