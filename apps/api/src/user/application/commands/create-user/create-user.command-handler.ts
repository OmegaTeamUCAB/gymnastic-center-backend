import {
  ApplicationService,
  EventHandler,
  EventStore,
  Result,
} from '@app/core';
import { CreateUserCommand, CreateUserResponse } from './types';
import { IdGenerator } from '@app/core/application/id/id-generator.interface';
import { User } from '../../../domain';
import {
  UserEmail,
  UserId,
  UserImage,
  UserName,
  UserPhone,
} from '../../../domain/value-objects';

export class CreateUserCommandHandler
  implements ApplicationService<CreateUserCommand, CreateUserResponse>
{
  constructor(
    private readonly idGenerator: IdGenerator<string>,
    private readonly eventStore: EventStore,
    private readonly eventHandler: EventHandler,
  ) {}

  async execute(
    command: CreateUserCommand,
  ): Promise<Result<CreateUserResponse>> {
    const id = this.idGenerator.generateId();

    const data = {
      name: new UserName(command.name),
      email: new UserEmail(command.email),
      phone: new UserPhone(command.phone),
      image: new UserImage(command.image),
    };

    const user = User.create(new UserId(id), data);
    const events = user.pullEvents();
    await this.eventStore.appendEvents(id, events);
    this.eventHandler.publishEvents(events);
    return Result.success<CreateUserResponse>({
      id,
    });
  }
}
