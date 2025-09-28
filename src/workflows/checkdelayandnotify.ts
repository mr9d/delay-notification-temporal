import { proxyActivities } from '@temporalio/workflow';

import { RouteInfoDto } from '../dto/routeinfo';
import { ClientInfoDto } from '../dto/clientinfo';
import { NotificationSettingsDto } from '../dto/settings';

import type * as activities from '../activities/index';

// Proxy activities so they can be called from the workflow.
// The timeout ensures each activity completes within 1 minute.
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

// Input DTO for the workflow, containing all necessary information for delay checking and notification
export type CheckDelayAndNotifyRequestDto = {
  orderId: string; // Unique order identifier
  routeInfo: RouteInfoDto; // Route details for the delivery
  promisedDurationSeconds: number; // Promised delivery duration in seconds
  notificationThresholdSeconds: number; // Threshold for when to notify the client
  clientInfo: ClientInfoDto; // Client contact information
  clientNotificationSettings: NotificationSettingsDto; // Client's notification preferences
};

// Output DTO for the workflow, summarizing the result and any errors
export type CheckDelayAndNotifyResponseDto = {
  success: boolean; // Whether the operation completed successfully
  estimatedDuration?: number; // Estimated duration in seconds
  smsSent: number; // Number of SMS sent
  emailsSent: number; // Number of emails sent
  errors: string[]; // Any errors encountered
};

/**
 * Main workflow to check for delivery delay and notify the client if needed.
 *
 * @param request - CheckDelayAndNotifyRequestDto containing all workflow input data
 * @returns CheckDelayAndNotifyResponseDto summarizing the workflow result
 */
export async function checkDelayAndNotify(
  request: CheckDelayAndNotifyRequestDto,
): Promise<CheckDelayAndNotifyResponseDto> {
  // Initialize the response object to track results and errors
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
  let durationDelta: number; // Difference between promised and estimated duration
  try {
    estimatedDuration = await estimateDurationInTraffic(request.routeInfo);
    response.estimatedDuration = estimatedDuration;
    durationDelta = request.promisedDurationSeconds - estimatedDuration;
  } catch (error) {
    response.errors.push((error as Error).message);
    // If estimation fails, but we are already out of time
    // (it might be more convenient to have different threshold for this case)
    if (request.promisedDurationSeconds < 0) {
      durationDelta = request.promisedDurationSeconds;
    } else {
      // If we can't estimate and are not late, exit early
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
    // Only proceed if SMS is enabled and a phone number is provided
    if (request.clientNotificationSettings.smsEnabled && request.clientInfo.phoneNumber) {
      // 3.1 Generate sms text (try custom, fallback to template)
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
    // Only proceed if email is enabled and an email address is provided
    if (request.clientNotificationSettings.emailEnabled && request.clientInfo.email) {
      // 4.1 Generate email text (try custom, fallback to template)
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

  // Execute notification activities (3 and 4) in parallel for efficiency
  await Promise.all([generateAndSendSms(), generateAndSendEmail()]);

  //
  // 5. Successfully conclude the workflow
  //
  response.success = true;
  return response;
}
