import { Inject } from '@nestjs/common';
import { MAILGUN } from '../constants';

export const MailgunClient = () =>
  Inject(MAILGUN);