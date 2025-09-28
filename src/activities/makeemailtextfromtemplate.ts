import { ClientInfoDto } from '../dto/clientinfo';
import { RouteInfoDto } from '../dto/routeinfo';

/**
 * Generates a templated email message for the customer about a delivery delay or early arrival.
 *
 * @param orderId - The unique identifier for the order
 * @param routeInfo - RouteInfoDto containing origin and destination addresses
 * @param expectedDelaySeconds - The number of seconds the delivery is delayed (negative) or early (positive)
 * @param clientInfo - ClientInfoDto containing customer name and contact info
 * @returns A templated email message string for the customer
 */
export async function makeEmailTextFromTemplate(
  orderId: string,
  routeInfo: RouteInfoDto,
  expectedDelaySeconds: number,
  clientInfo: ClientInfoDto,
): Promise<string> {
  // If the delivery is delayed (expectedDelaySeconds < 0), return a delay notification template
  if (expectedDelaySeconds < 0) {
    return `Dear ${clientInfo.firstName} ${clientInfo.secondName},

We hope this message finds you well. We wanted to inform you that your delivery (${orderId}) from ${routeInfo.originAddress} to ${routeInfo.destinationAddress} is currently experiencing a delay of approximately ${Math.round(expectedDelaySeconds / 60)} minutes.

At FastExpress, we prioritize timely deliveries and customer satisfaction. We are working diligently to get your order to you as soon as possible.

Thank you for your understanding and patience. If you have any questions, please feel free to reach out.

Best regards,
The FastExpress Team`;
  } else {
    // If the delivery is early or on time, return a positive notification template
    return `Dear ${clientInfo.firstName} ${clientInfo.secondName},

We wanted to share some great news about your recent order (Order ID: ${orderId}) with FastExpress! Your delivery, originating from ${routeInfo.originAddress}, is expected to arrive at ${routeInfo.destinationAddress} in just 74 minutes.

We’re committed to providing timely service and ensuring your satisfaction. Thank you for choosing FastExpress!

Best regards,
The FastExpress Team`;
  }
}
