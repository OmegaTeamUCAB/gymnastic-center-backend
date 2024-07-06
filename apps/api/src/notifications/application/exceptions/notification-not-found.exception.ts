import { ApplicationException } from '@app/core';

export class NotificationNotFoundException extends ApplicationException {
  constructor() {
    super('Notification not found');
  }
}
