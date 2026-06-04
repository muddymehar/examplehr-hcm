import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaveBalance, BalanceAuditLog } from '@database/entities';
import { LeaveBalanceService } from './services/leave-balance.service';
import { LeaveBalanceController } from './controllers/leave-balance.controller';

@Module({
  imports: [TypeOrmModule.forFeature([LeaveBalance, BalanceAuditLog])],
  controllers: [LeaveBalanceController],
  providers: [LeaveBalanceService],
  exports: [LeaveBalanceService],
})
export class LeaveBalanceModule {}
