import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private readonly reflector: Reflector) {
    super();
  }
  async canActivate(ctx: ExecutionContext) {
    const isPublic = this.reflector.get('IS_PUBLIC_KEY', ctx.getHandler());
    if (isPublic) {
      return true;
    }

    return super.canActivate(ctx) as boolean;
  }
}
