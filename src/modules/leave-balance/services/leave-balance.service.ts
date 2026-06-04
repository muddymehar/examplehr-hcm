import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LeaveBalance, BalanceAuditLog } from '@database/entities';
import {
  CreateLeaveBalanceDto,
  UpdateLeaveBalanceDto,
} from './dtos/leave-balance.dto';
import {
  OptimisticLockException,
  InsufficientBalanceException,
} from '@common/exceptions/custom-exceptions';
import { AUDIT_ACTIONS } from '@common/constants';
import { AppLogger } from '@common/utils/logger';

@Injectable()
export class LeaveBalanceService {
  private readonly logger = new AppLogger(LeaveBalanceService.name);

  constructor(
    @InjectRepository(LeaveBalance)
    private leaveBalanceRepo: Repository<LeaveBalance>,
    @InjectRepository(BalanceAuditLog)
    private auditLogRepo: Repository<BalanceAuditLog>,
  ) {}

  async createBalance(
    createDto: CreateLeaveBalanceDto,
  ): Promise<LeaveBalance> {
    this.logger.log(
      `Creating balance for employee ${createDto.employee_id}`,
      'LeaveBalanceService.createBalance',
    );

    const balance = this.leaveBalanceRepo.create({
      ...createDto,
      used: 0,
      available: createDto.balance,
      version: 0,
    });

    const saved = await this.leaveBalanceRepo.save(balance);

    // Log audit trail
    await this.auditLogRepo.save({
      employee_id: createDto.employee_id,
      leave_type: createDto.leave_type,
      action_type: AUDIT_ACTIONS.BALANCE_INITIALIZED,
      previous_balance: 0,
      new_balance: createDto.balance,
      change_amount: createDto.balance,
      reason: 'Initial balance creation',
    });

    return saved;
  }

  async getBalance(
    employeeId: string,
    leaveType: string,
  ): Promise<LeaveBalance> {
    return this.leaveBalanceRepo.findOne({
      where: { employee_id: employeeId, leave_type: leaveType },
    });
  }

  async deductBalance(
    employeeId: string,
    leaveType: string,
    daysToDeduct: number,
    reason?: string,
  ): Promise<LeaveBalance> {
    this.logger.log(
      `Deducting ${daysToDeduct} days from ${employeeId}`,
      'LeaveBalanceService.deductBalance',
    );

    const balance = await this.getBalance(employeeId, leaveType);
    if (!balance) {
      throw new Error('Balance not found');
    }

    if (balance.available < daysToDeduct) {
      throw new InsufficientBalanceException(
        `Available balance (${balance.available}) is less than requested (${daysToDeduct})`,
      );
    }

    const previousBalance = balance.available;
    balance.used += daysToDeduct;
    balance.available -= daysToDeduct;
    balance.version += 1;

    const updated = await this.leaveBalanceRepo.save(balance);

    // Log audit trail
    await this.auditLogRepo.save({
      employee_id: employeeId,
      leave_type: leaveType,
      action_type: AUDIT_ACTIONS.BALANCE_DEDUCTED,
      previous_balance: previousBalance,
      new_balance: balance.available,
      change_amount: -daysToDeduct,
      reason: reason || 'Manual deduction',
    });

    return updated;
  }

  async restoreBalance(
    employeeId: string,
    leaveType: string,
    daysToRestore: number,
    reason?: string,
  ): Promise<LeaveBalance> {
    this.logger.log(
      `Restoring ${daysToRestore} days to ${employeeId}`,
      'LeaveBalanceService.restoreBalance',
    );

    const balance = await this.getBalance(employeeId, leaveType);
    if (!balance) {
      throw new Error('Balance not found');
    }

    const previousBalance = balance.available;
    balance.used = Math.max(0, balance.used - daysToRestore);
    balance.available += daysToRestore;
    balance.version += 1;

    const updated = await this.leaveBalanceRepo.save(balance);

    // Log audit trail
    await this.auditLogRepo.save({
      employee_id: employeeId,
      leave_type: leaveType,
      action_type: AUDIT_ACTIONS.BALANCE_RESTORED,
      previous_balance: previousBalance,
      new_balance: balance.available,
      change_amount: daysToRestore,
      reason: reason || 'Manual restoration',
    });

    return updated;
  }

  async updateBalanceOptimistic(
    employeeId: string,
    leaveType: string,
    updateDto: UpdateLeaveBalanceDto,
  ): Promise<LeaveBalance> {
    const balance = await this.getBalance(employeeId, leaveType);

    if (!balance) {
      throw new Error('Balance not found');
    }

    // Check version for optimistic locking
    if (balance.version !== updateDto.version) {
      throw new OptimisticLockException(
        `Version mismatch: expected ${updateDto.version}, got ${balance.version}`,
      );
    }

    const previousBalance = balance.available;

    // Update fields
    if (updateDto.balance !== undefined) balance.balance = updateDto.balance;
    if (updateDto.used !== undefined) balance.used = updateDto.used;
    if (updateDto.available !== undefined)
      balance.available = updateDto.available;

    balance.version += 1;

    const updated = await this.leaveBalanceRepo.save(balance);

    // Log audit trail
    await this.auditLogRepo.save({
      employee_id: employeeId,
      leave_type: leaveType,
      action_type: AUDIT_ACTIONS.BALANCE_UPDATED,
      previous_balance: previousBalance,
      new_balance: updated.available,
      change_amount: updated.available - previousBalance,
      reason: 'Balance updated',
    });

    return updated;
  }

  async getEmployeeBalances(employeeId: string): Promise<LeaveBalance[]> {
    return this.leaveBalanceRepo.find({
      where: { employee_id: employeeId },
    });
  }

  async getAuditLog(
    employeeId: string,
    leaveType?: string,
    limit: number = 50,
  ): Promise<BalanceAuditLog[]> {
    const query = this.auditLogRepo
      .createQueryBuilder('log')
      .where('log.employee_id = :employeeId', { employeeId });

    if (leaveType) {
      query.andWhere('log.leave_type = :leaveType', { leaveType });
    }

    return query.orderBy('log.created_at', 'DESC').take(limit).getMany();
  }
}
