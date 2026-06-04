import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { LeaveBalanceService } from '../services/leave-balance.service';
import {
  CreateLeaveBalanceDto,
  UpdateLeaveBalanceDto,
  LeaveBalanceResponseDto,
} from '../dtos/leave-balance.dto';
import { PaginationDto } from '@common/dtos/pagination.dto';

@Controller('api/leave-balance')
export class LeaveBalanceController {
  constructor(private readonly leaveBalanceService: LeaveBalanceService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createDto: CreateLeaveBalanceDto,
  ): Promise<LeaveBalanceResponseDto> {
    return this.leaveBalanceService.createBalance(createDto);
  }

  @Get(':employeeId/:leaveType')
  async getBalance(
    @Param('employeeId') employeeId: string,
    @Param('leaveType') leaveType: string,
  ): Promise<LeaveBalanceResponseDto> {
    return this.leaveBalanceService.getBalance(employeeId, leaveType);
  }

  @Get(':employeeId')
  async getEmployeeBalances(
    @Param('employeeId') employeeId: string,
  ): Promise<LeaveBalanceResponseDto[]> {
    return this.leaveBalanceService.getEmployeeBalances(employeeId);
  }

  @Put(':employeeId/:leaveType')
  async update(
    @Param('employeeId') employeeId: string,
    @Param('leaveType') leaveType: string,
    @Body() updateDto: UpdateLeaveBalanceDto,
  ): Promise<LeaveBalanceResponseDto> {
    return this.leaveBalanceService.updateBalanceOptimistic(
      employeeId,
      leaveType,
      updateDto,
    );
  }

  @Post(':employeeId/:leaveType/deduct')
  async deductBalance(
    @Param('employeeId') employeeId: string,
    @Param('leaveType') leaveType: string,
    @Body() body: { days: number; reason?: string },
  ): Promise<LeaveBalanceResponseDto> {
    return this.leaveBalanceService.deductBalance(
      employeeId,
      leaveType,
      body.days,
      body.reason,
    );
  }

  @Post(':employeeId/:leaveType/restore')
  async restoreBalance(
    @Param('employeeId') employeeId: string,
    @Param('leaveType') leaveType: string,
    @Body() body: { days: number; reason?: string },
  ): Promise<LeaveBalanceResponseDto> {
    return this.leaveBalanceService.restoreBalance(
      employeeId,
      leaveType,
      body.days,
      body.reason,
    );
  }

  @Get(':employeeId/:leaveType/audit-log')
  async getAuditLog(
    @Param('employeeId') employeeId: string,
    @Param('leaveType') leaveType: string,
    @Query() paginationDto: PaginationDto,
  ) {
    const limit = paginationDto.limit || 50;
    return this.leaveBalanceService.getAuditLog(employeeId, leaveType, limit);
  }
}
