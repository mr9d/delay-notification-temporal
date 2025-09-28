import { ClientInfoDto } from "../dto/clientinfo";
import { RouteInfoDto } from "../dto/routeinfo";
import { generateMessage } from "../services/openai";

export async function generateEmailText(
  orderId: string,
  routeInfo: RouteInfoDto,
  expectedDelaySeconds: number,
  clientInfo: ClientInfoDto,
): Promise<string> {
  return await generateMessage(`Generate a friendly message for the customer about the ${expectedDelaySeconds < 0 ? 'delay' : 'earlier arrival'} of their delivery.
  The message should include the following details:
  - Customer's name: ${clientInfo.firstName} ${clientInfo.secondName}
  - Order ID: ${orderId}
  - Expected ${expectedDelaySeconds < 0 ? 'delay' : 'earlier arrival'} in minutes: ${Math.round(expectedDelaySeconds / 60)}
  - Origin address: ${routeInfo.originAddress}
  - Destination address: ${routeInfo.destinationAddress}
  - Delivery company name: FastExpress

  The message should be concise and reassuring, emphasizing our commitment to timely delivery and customer satisfaction.
  The message should be suitable for an email format.
  Do not include anything else apart from the message itself.`);
};
