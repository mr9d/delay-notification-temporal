import { proxyActivities } from '@temporalio/workflow';

import { RouteInfoDto } from '../dto/routeinfo';
import { ClientInfoDto } from '../dto/clientinfo';
import { NotificationSettingsDto } from '../dto/settings';

import type * as activities from '../activities/index';

const {
  estimateDurationInTraffic,
  generateEmailText,
  generateSmsText,
  makeEmailTextFromTemplate,
  makeSmsTextFromTemplate,
  sendEmail,
  sendSms,
} = proxyActivities<typeof activities>({
  startToCloseTimeout: '1 minute',
});

export type CheckDelayAndNotifyRequestDto = {
  orderId: string;
  routeInfo: RouteInfoDto;
  promisedDurationSeconds: number;
  notificationThresholdSeconds: number;
  clientInfo: ClientInfoDto;
  clientNotificationSettings: NotificationSettingsDto;
};

export type CheckDelayAndNotifyResponseDto = {
  success: boolean;
  estimatedDuration?: number;
  smsSent: number;
  emailsSent: number;
  errors: string[];
};

export async function checkDelayAndNotify(
  request: CheckDelayAndNotifyRequestDto,
): Promise<CheckDelayAndNotifyResponseDto> {
  const response: CheckDelayAndNotifyResponseDto = {
    success: false,
    smsSent: 0,
    emailsSent: 0,
    errors: [],
  };

  //
  // 1. Get estimated duration in traffic (if possible)
  //
  let estimatedDuration: number | undefined;
  let durationDelta: number;
  try {
    estimatedDuration = await estimateDurationInTraffic(request.routeInfo);
    response.estimatedDuration = estimatedDuration;
    durationDelta = request.promisedDurationSeconds - estimatedDuration;
  } catch (error) {
    response.errors.push((error as Error).message);
    // We are already out of time, but we don't know how much
    // It might be more convenient to have different threshold for this case
    if (request.promisedDurationSeconds < 0) {
      durationDelta = request.promisedDurationSeconds;
    }
    // We are currenly on time, but don't have reliable estimations
    else {
      return response;
    }
  }

  //
  // 2. Check if we need to notify the client
  //
  if (Math.abs(durationDelta) < request.notificationThresholdSeconds) {
    response.success = true;
    return response;
  }

  //
  // 3. Generate and send SMS
  //
  const generateAndSendSms = async () => {
    if (request.clientNotificationSettings.smsEnabled && request.clientInfo.phoneNumber) {
      // 3.1 Generate sms text
      let smsText;
      try {
        smsText = await generateSmsText(request.orderId, durationDelta, request.clientInfo);
      } catch (error) {
        response.errors.push((error as Error).message);
        smsText = await makeSmsTextFromTemplate(request.orderId, durationDelta, request.clientInfo);
      }

      // 3.2 Send an sms
      try {
        await sendSms(request.clientInfo.phoneNumber, smsText);
        response.smsSent++;
      } catch (error) {
        response.errors.push((error as Error).message);
      }
    }
  };

  //
  // 4. Generate and send email
  //
  const generateAndSendEmail = async () => {
    if (request.clientNotificationSettings.emailEnabled && request.clientInfo.email) {
      // 4.1 Generate email text
      let emailText;
      try {
        emailText = await generateEmailText(request.orderId, request.routeInfo, durationDelta, request.clientInfo);
      } catch (error) {
        response.errors.push((error as Error).message);
        emailText = await makeEmailTextFromTemplate(
          request.orderId,
          request.routeInfo,
          durationDelta,
          request.clientInfo,
        );
      }

      // 4.2 Send an email
      try {
        await sendEmail(request.clientInfo.email, emailText);
        response.emailsSent++;
      } catch (error) {
        response.errors.push((error as Error).message);
      }
    }
  };

  // Execute notification activities (3 and 4) in parallel
  await Promise.all([generateAndSendSms(), generateAndSendEmail()]);

  //
  // 5. Successfully conclude the workflow
  //
  response.success = true;
  return response;
}
