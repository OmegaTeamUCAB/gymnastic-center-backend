import {
  HttpException,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { DomainException } from '../domain';
import { ApplicationException } from '../application';

export const baseExceptionParser = (error: Error) => {
  if (error instanceof DomainException)
    throw new UnprocessableEntityException(error.message);
  else if (error instanceof ApplicationException)
    throw new NotFoundException(error.message);
  throw new InternalServerErrorException(error);
};
