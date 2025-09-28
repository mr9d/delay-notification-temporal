import { ClientInfoDto } from "../dto/clientinfo";
import { RouteInfoDto } from "../dto/routeinfo";

export async function makeEmailTextFromTemplate(
  orderId: string,
  routeInfo: RouteInfoDto,
  expectedDelaySeconds: number,
  clientInfo: ClientInfoDto,
): Promise<string> {
  if (expectedDelaySeconds < 0) {
    return `Dear ${clientInfo.firstName} ${clientInfo.secondName},

We hope this message finds you well. We wanted to inform you that your delivery (${orderId}) from ${routeInfo.originAddress} to ${routeInfo.destinationAddress} is currently experiencing a delay of approximately ${Math.round(expectedDelaySeconds / 60)} minutes.

At FastExpress, we prioritize timely deliveries and customer satisfaction. We are working diligently to get your order to you as soon as possible.

Thank you for your understanding and patience. If you have any questions, please feel free to reach out.

Best regards,
The FastExpress Team`;
  } else {
    return `Dear ${clientInfo.firstName} ${clientInfo.secondName},

We wanted to share some great news about your recent order (Order ID: ${orderId}) with FastExpress! Your delivery, originating from ${routeInfo.originAddress}, is expected to arrive at ${routeInfo.destinationAddress} in just 74 minutes.

We’re committed to providing timely service and ensuring your satisfaction. Thank you for choosing FastExpress!

Best regards,
The FastExpress Team`;
  }
}
