import {
  Service,
  EventHandler,
  EventStore,
  Result,
} from '@app/core';
import { UpdateUserCommand, UpdateUserResponse } from './types';
import { UserNotFoundException } from '../../exceptions/user-not-found.exception';
import { User } from '../../../domain';
import {
  UserId,
  UserImage,
  UserName,
  UserPhone,
} from '../../../domain/value-objects';

export class UpdateUserCommandHandler
  implements Service<UpdateUserCommand, UpdateUserResponse>
{
  constructor(
    private readonly eventStore: EventStore,
    private readonly eventHandler: EventHandler,
  ) {}

  async execute(
    command: UpdateUserCommand,
  ): Promise<Result<UpdateUserResponse>> {
    const events = await this.eventStore.getEventsByStream(command.id);
    if (events.length === 0) throw new UserNotFoundException();
    const user = User.loadFromHistroy(new UserId(command.id), events);
    if (command.name) user.updateName(new UserName(command.name));
    if (command.phone) user.updatePhone(new UserPhone(command.phone));
    if (command.image) user.updateImage(new UserImage(command.image));
    const newEvents = user.pullEvents();
    await this.eventStore.appendEvents(command.id, newEvents);
    this.eventHandler.publishEvents(newEvents);
    return Result.success<UpdateUserResponse>({
      id: command.id,
    });
  }
}
