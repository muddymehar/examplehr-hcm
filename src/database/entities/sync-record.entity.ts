import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

/**
 * SyncRecord Entity
 * Tracks synchronization events with the HCM system
 */
@Entity('sync_record')
@Index(['sync_type', 'created_at'])
@Index(['status'])
@Index(['hcm_record_id'])
export class SyncRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50 })
  sync_type: 'time_off_approval' | 'balance_sync' | 'batch_reconciliation';

  @Column({ nullable: true })
  time_off_request_id: string;

  @Column({ nullable: true })
  leave_balance_id: string;

  @Column({ nullable: true })
  hcm_record_id: string;

  @Column({ type: 'varchar', length: 50, default: 'pending' })
  status: 'pending' | 'success' | 'failed' | 'retry';

  @Column('integer', { default: 0 })
  retry_count: number;

  @Column({ nullable: true })
  error_message: string;

  @Column({ nullable: true })
  hcm_response: string; // JSON

  @Column({ nullable: true })
  retry_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
