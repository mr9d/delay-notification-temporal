import { send } from '../services/twilio';

export async function sendSms(phoneNumber: string, text: string): Promise<boolean> {
  return await send(phoneNumber, '+15005550006', text);
}
