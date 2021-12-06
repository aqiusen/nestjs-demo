import { Module } from '@nestjs/common';
import { RoleGuardService } from './role-guard.service';
import { RoleGuardController } from './role-guard.controller';

@Module({
  providers: [RoleGuardService],
  controllers: [RoleGuardController],
})
export class RoleGuardModule {}
