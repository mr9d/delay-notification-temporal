import { ClientInfoDto } from '../dto/clientinfo';
import { generateMessage } from '../services/openai';

/**
 * Generates a concise SMS message for the customer about a delivery delay or early arrival.
 *
 * @param orderId - The unique identifier for the order
 * @param expectedDelaySeconds - The number of seconds the delivery is delayed (negative) or early (positive)
 * @param clientInfo - ClientInfoDto containing customer name and contact info
 * @returns A very short SMS message string for the customer
 */
export async function generateSmsText(
  orderId: string,
  expectedDelaySeconds: number,
  clientInfo: ClientInfoDto,
): Promise<string> {
  // Compose a prompt for the AI message generator, including all relevant delivery and customer details.
  // The prompt adapts based on whether the delivery is delayed or early, and is optimized for SMS length.
  return await generateMessage(`Generate a very short SMS for the customer about the ${expectedDelaySeconds < 0 ? 'delay' : 'earlier arrival'} of their delivery.
  The message should include the following details:
  - Customer's name: ${clientInfo.firstName}
  - Order ID: ${orderId}
  - Expected ${expectedDelaySeconds < 0 ? 'delay' : 'earlier arrival'} in minutes: ${Math.round(expectedDelaySeconds / 60)}

  The message should be very short bacause of SMS limitation.
  Do not include anything else apart from the message itself.`);
}
