import { ClientInfoDto } from '../dto/clientinfo';

/**
 * Generates a templated SMS message for the customer about a delivery delay or early arrival.
 *
 * @param orderId - The unique identifier for the order
 * @param expectedDelaySeconds - The number of seconds the delivery is delayed (negative) or early (positive)
 * @param clientInfo - ClientInfoDto containing customer name and contact info
 * @returns A templated SMS message string for the customer
 */
export async function makeSmsTextFromTemplate(
  orderId: string,
  expectedDelaySeconds: number,
  clientInfo: ClientInfoDto,
): Promise<string> {
  // If the delivery is delayed (expectedDelaySeconds < 0), return a delay notification SMS template
  if (expectedDelaySeconds < 0) {
    return `Hi ${clientInfo.firstName}, your delivery for ${orderId} is delayed by ${Math.round(-expectedDelaySeconds / 60)} minutes. Thank you for your patience.`;
  } else {
    // If the delivery is early or on time, return a positive notification SMS template
    return `Hi ${clientInfo.firstName}, your delivery (${orderId}) is arriving ${Math.round(expectedDelaySeconds / 60)} mins earlier than expected!`;
  }
}
