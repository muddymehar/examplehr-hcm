import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

/**
 * TimeOffRequest Entity
 * Represents a request for time off (leave)
 */
@Entity('time_off_request')
@Index(['employee_id', 'status'])
@Index(['start_date', 'end_date'])
export class TimeOffRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  employee_id: string;

  @Column()
  leave_type: string;

  @Column('date')
  start_date: Date;

  @Column('date')
  end_date: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  days_requested: number;

  @Column({ type: 'varchar', length: 50, default: 'pending' })
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';

  @Column({ nullable: true })
  reason: string;

  @Column({ nullable: true })
  approver_id: string;

  @Column({ nullable: true })
  approval_date: Date;

  @Column({ nullable: true })
  approval_comment: string;

  @Column({ nullable: true })
  hcm_record_id: string;

  @Column({ default: false })
  synced_to_hcm: boolean;

  @Column({ nullable: true })
  last_hcm_sync: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
