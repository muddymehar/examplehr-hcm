import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from '@config/database.config';
import { LeaveBalance, TimeOffRequest, BalanceAuditLog, SyncRecord } from './entities';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    TypeOrmModule.forFeature([LeaveBalance, TimeOffRequest, BalanceAuditLog, SyncRecord]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
