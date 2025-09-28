/**
 * Data Transfer Object (DTO) representing client notification preferences.
 *
 * @property smsEnabled - Whether SMS notifications are enabled for the client
 * @property emailEnabled - Whether email notifications are enabled for the client
 */
export type NotificationSettingsDto = {
  smsEnabled: boolean;
  emailEnabled: boolean;
};
