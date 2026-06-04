import { IsString, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';

export class CreateLeaveBalanceDto {
  @IsString()
  employee_id: string;

  @IsString()
  leave_type: string;

  @IsNumber()
  @Min(0)
  balance: number;

  @IsOptional()
  @IsString()
  hcm_record_id?: string;
}

export class UpdateLeaveBalanceDto {
  @IsNumber()
  @Min(0)
  balance?: number;

  @IsNumber()
  @Min(0)
  used?: number;

  @IsNumber()
  @Min(0)
  available?: number;

  @IsNumber()
  @Min(0)
  version: number; // For optimistic locking
}

export class LeaveBalanceResponseDto {
  @IsUUID()
  id: string;

  @IsString()
  employee_id: string;

  @IsString()
  leave_type: string;

  @IsNumber()
  balance: number;

  @IsNumber()
  used: number;

  @IsNumber()
  available: number;

  @IsNumber()
  version: number;

  @IsOptional()
  @IsString()
  hcm_record_id?: string;

  @IsOptional()
  last_synced_at?: Date;

  created_at: Date;
  updated_at: Date;
}
