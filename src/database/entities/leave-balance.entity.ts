import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

/**
 * LeaveBalance Entity
 * Represents an employee's leave balance for a specific leave type
 * Uses optimistic locking via version column
 */
@Entity('leave_balance')
@Index(['employee_id', 'leave_type'], { unique: true })
export class LeaveBalance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  employee_id: string;

  @Column()
  leave_type: string; // 'annual', 'sick', 'personal', etc.

  @Column('decimal', { precision: 10, scale: 2 })
  balance: number;

  @Column('decimal', { precision: 10, scale: 2 })
  used: number;

  @Column('decimal', { precision: 10, scale: 2 })
  available: number;

  @Column('integer', { default: 0 })
  version: number; // For optimistic locking

  @Column({ nullable: true })
  hcm_record_id: string; // HCM system record ID

  @Column({ nullable: true })
  last_synced_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
