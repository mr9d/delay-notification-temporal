import { ClientInfoDto } from '../dto/clientinfo';
import { generateMessage } from '../services/openai';

export async function generateSmsText(
  orderId: string,
  expectedDelaySeconds: number,
  clientInfo: ClientInfoDto,
): Promise<string> {
  return await generateMessage(`Generate a very short SMS for the customer about the ${expectedDelaySeconds < 0 ? 'delay' : 'earlier arrival'} of their delivery.
  The message should include the following details:
  - Customer's name: ${clientInfo.firstName}
  - Order ID: ${orderId}
  - Expected ${expectedDelaySeconds < 0 ? 'delay' : 'earlier arrival'} in minutes: ${Math.round(expectedDelaySeconds / 60)}

  The message should be very short bacause of SMS limitation.
  Do not include anything else apart from the message itself.`);
}
