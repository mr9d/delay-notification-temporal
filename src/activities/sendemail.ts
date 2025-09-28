import { send } from "../services/sendgrid";

export async function sendEmail(email: string, text: string): Promise<boolean> {
  await send(email, "Delivery Update", text);
  return true;
};
