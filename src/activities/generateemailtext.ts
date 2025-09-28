import { ClientInfoDto } from '../dto/clientinfo';
import { RouteInfoDto } from '../dto/routeinfo';
import { generateMessage } from '../services/openai';

/**
 * Generates a customer-facing email message about a delivery delay or early arrival.
 *
 * @param orderId - The unique identifier for the order
 * @param routeInfo - RouteInfoDto containing origin and destination addresses
 * @param expectedDelaySeconds - The number of seconds the delivery is delayed (negative) or early (positive)
 * @param clientInfo - ClientInfoDto containing customer name and contact info
 * @returns A friendly, concise email message string for the customer
 */
export async function generateEmailText(
  orderId: string,
  routeInfo: RouteInfoDto,
  expectedDelaySeconds: number,
  clientInfo: ClientInfoDto,
): Promise<string> {
  // Use company name from env or fallback
  const companyName = process.env.DELIVERY_COMPANY_NAME || 'FastExpress';

  // Compose a prompt for the AI message generator, including all relevant delivery and customer details.
  // The prompt adapts based on whether the delivery is delayed or early.
  return await generateMessage(`Generate a friendly message for the customer about the ${expectedDelaySeconds < 0 ? 'delay' : 'earlier arrival'} of their delivery.
  The message should include the following details:
  - Customer's name: ${clientInfo.firstName} ${clientInfo.secondName}
  - Order ID: ${orderId}
  - Expected ${expectedDelaySeconds < 0 ? 'delay' : 'earlier arrival'} in minutes: ${Math.round(expectedDelaySeconds / 60)}
  - Origin address: ${routeInfo.originAddress}
  - Destination address: ${routeInfo.destinationAddress}
  - Delivery company name: ${companyName}

  The message should be concise and reassuring, emphasizing our commitment to timely delivery and customer satisfaction.
  The message should be suitable for an email format.
  Do not include anything else apart from the message itself.`);
}
