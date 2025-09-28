import { ClientInfoDto } from '../dto/clientinfo';

export async function makeSmsTextFromTemplate(
  orderId: string,
  expectedDelaySeconds: number,
  clientInfo: ClientInfoDto,
): Promise<string> {
  if (expectedDelaySeconds < 0) {
    return `Hi ${clientInfo.firstName}, your delivery for ${orderId} is delayed by ${Math.round(-expectedDelaySeconds / 60)} minutes. Thank you for your patience.`;
  } else {
    return `Hi ${clientInfo.firstName}, your delivery (${orderId}) is arriving ${Math.round(expectedDelaySeconds / 60)} mins earlier than expected!`;
  }
}
