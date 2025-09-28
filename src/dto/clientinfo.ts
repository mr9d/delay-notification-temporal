/**
 * Data Transfer Object (DTO) representing client information for notifications and delivery updates.
 *
 * @property id - Unique identifier for the client
 * @property firstName - Client's first name
 * @property secondName - Client's last name
 * @property phoneNumber - (Optional) Client's phone number for SMS notifications
 * @property email - (Optional) Client's email address for email notifications
 */
export type ClientInfoDto = {
  id: string;
  firstName: string;
  secondName: string;
  phoneNumber?: string;
  email?: string;
};
