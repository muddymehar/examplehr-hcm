import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@database/database.module';
import { LeaveBalanceModule } from '@modules/leave-balance/leave-balance.module';
import { TimeOffModule } from '@modules/time-off/time-off.module';
import { HealthModule } from '@modules/health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    LeaveBalanceModule,
    TimeOffModule,
    HealthModule,
  ],
})
export class AppModule {}
