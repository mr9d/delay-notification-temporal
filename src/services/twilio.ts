import twilio from 'twilio';

const testClient = twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!);

export async function send(toNumber: string, fromNumber: string, body: string): Promise<boolean> {
  const message = await testClient.messages.create({
    from: fromNumber,
    to: toNumber,
    body,
  });
  //console.log("Message SID:", message.sid);
  return true;
}
