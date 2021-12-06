import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
/**
 * 角色守卫例子
 * */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly refector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    //通过反射器获取角色数据
    const roles = this.refector.get('myRoles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const { user } = request.query;
    console.log('user', user, 'get roles = ', roles);
    return !!roles.find((role) => role === user);
  }
}
