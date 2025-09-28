import twilio from 'twilio';

// Initialize the Twilio client with account SID and auth token from environment variables.
const testClient = twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!);

/**
 * Sends an SMS message using the Twilio service.
 *
 * @param toNumber - The recipient's phone number
 * @param fromNumber - The sender's phone number
 * @param body - The SMS message content
 * @returns True if the SMS was sent successfully
 */
export async function send(toNumber: string, fromNumber: string, body: string): Promise<boolean> {
  // Ensure the API keys are set in environment variables.
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
    throw new Error('TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN are not set in environment variables');
  }

  // Create and send the SMS message using Twilio's API.
  const message = await testClient.messages.create({
    from: fromNumber,
    to: toNumber,
    body,
  });

  //console.log("Message SID:", message.sid);
  return true;
}
