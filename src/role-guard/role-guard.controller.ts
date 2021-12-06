import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { RoleGuardService } from './role-guard.service';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
/**
 * 第一，需要自定义Roles 装饰器，
 * 第二，需要UseGuards 调用守卫
 * */
@ApiBearerAuth()
@ApiTags('role-guard')
@UseGuards(RolesGuard)
@Controller('role-guard')
export class RoleGuardController {
  constructor(private readonly roleGuradService: RoleGuardService) {}
  /**
   * 如果Roles 传递的是解构之后的数据，那么最后通过反射获取的就是一个数组
   * [ 'admin', 'user' ]
   * 这个函数如果用户没有权限访问，返回的结果是403 forbidden
   * */
  @Get()
  @Roles('admin', 'user')
  fetch(@Query() { id }): string {
    return this.roleGuradService.fetch(id);
  }
}
