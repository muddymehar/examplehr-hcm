import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimeOffRequest, SyncRecord, BalanceAuditLog } from '@database/entities';
import { TimeOffRequestService } from './services/time-off-request.service';
import { TimeOffRequestController } from './controllers/time-off-request.controller';
import { LeaveBalanceModule } from '@modules/leave-balance/leave-balance.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TimeOffRequest, SyncRecord, BalanceAuditLog]),
    LeaveBalanceModule,
  ],
  controllers: [TimeOffRequestController],
  providers: [TimeOffRequestService],
  exports: [TimeOffRequestService],
})
export class TimeOffModule {}
