import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

export const UserIdReq = createParamDecorator(
  (data: any, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const userId = request.userId;
    if (!userId)
      throw new InternalServerErrorException(
        'User id no encontrado en la request',
      );
    return userId;
  },
);
