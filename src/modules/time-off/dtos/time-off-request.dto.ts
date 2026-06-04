import {
  IsString,
  IsDate,
  IsNumber,
  IsOptional,
  IsUUID,
  IsEnum,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum TimeOffStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
}

export class CreateTimeOffRequestDto {
  @IsString()
  employee_id: string;

  @IsString()
  leave_type: string;

  @IsDate()
  @Type(() => Date)
  start_date: Date;

  @IsDate()
  @Type(() => Date)
  end_date: Date;

  @IsNumber()
  @Min(0.5)
  days_requested: number;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsString()
  hcm_record_id?: string;
}

export class ApproveTimeOffRequestDto {
  @IsString()
  approver_id: string;

  @IsOptional()
  @IsString()
  approval_comment?: string;
}

export class RejectTimeOffRequestDto {
  @IsString()
  approver_id: string;

  @IsString()
  reason: string;
}

export class TimeOffRequestResponseDto {
  @IsUUID()
  id: string;

  @IsString()
  employee_id: string;

  @IsString()
  leave_type: string;

  @IsDate()
  start_date: Date;

  @IsDate()
  end_date: Date;

  @IsNumber()
  days_requested: number;

  @IsEnum(TimeOffStatus)
  status: TimeOffStatus;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsString()
  approver_id?: string;

  @IsOptional()
  @IsDate()
  approval_date?: Date;

  @IsOptional()
  @IsString()
  approval_comment?: string;

  @IsOptional()
  @IsString()
  hcm_record_id?: string;

  synced_to_hcm: boolean;

  @IsOptional()
  @IsDate()
  last_hcm_sync?: Date;

  created_at: Date;
  updated_at: Date;
}
