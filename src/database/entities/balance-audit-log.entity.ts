import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

/**
 * BalanceAuditLog Entity
 * Logs all changes to leave balances for audit trails
 */
@Entity('balance_audit_log')
@Index(['employee_id', 'created_at'])
@Index(['action_type'])
export class BalanceAuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  employee_id: string;

  @Column()
  leave_type: string;

  @Column({ type: 'varchar', length: 50 })
  action_type:
    | 'balance_initialized'
    | 'balance_updated'
    | 'balance_deducted'
    | 'balance_restored'
    | 'balance_synced'
    | 'balance_reconciled';

  @Column('decimal', { precision: 10, scale: 2 })
  previous_balance: number;

  @Column('decimal', { precision: 10, scale: 2 })
  new_balance: number;

  @Column('decimal', { precision: 10, scale: 2 })
  change_amount: number;

  @Column({ nullable: true })
  reason: string;

  @Column({ nullable: true })
  time_off_request_id: string;

  @Column({ nullable: true })
  sync_record_id: string;

  @Column({ nullable: true })
  metadata: string; // JSON

  @CreateDateColumn()
  created_at: Date;
}
