import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { LeaveBalance, TimeOffRequest, BalanceAuditLog, SyncRecord } from '@database/entities';
import * as path from 'path';

const dbPath = process.env.DATABASE_PATH || path.join(process.cwd(), 'data', 'leave-mgmt.db');

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'better-sqlite3' as any,
  database: dbPath,
  entities: [LeaveBalance, TimeOffRequest, BalanceAuditLog, SyncRecord],
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
  driver: require('better-sqlite3'),
};
