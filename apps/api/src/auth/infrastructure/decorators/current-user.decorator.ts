import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: any, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    if (!user)
      throw new InternalServerErrorException(
        'User no encontrado en la request',
      );
    if (!data) return user;
    return user[data];
  },
);
