import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TimeOffRequest, SyncRecord, BalanceAuditLog } from '@database/entities';
import {
  CreateTimeOffRequestDto,
  ApproveTimeOffRequestDto,
  RejectTimeOffRequestDto,
  TimeOffStatus,
} from '../dtos/time-off-request.dto';
import { HcmServiceException } from '@common/exceptions/custom-exceptions';
import { SYNC_TYPES, AUDIT_ACTIONS, TIME_OFF_STATUS } from '@common/constants';
import { AppLogger } from '@common/utils/logger';
import { LeaveBalanceService } from '@modules/leave-balance/services/leave-balance.service';

@Injectable()
export class TimeOffRequestService {
  private readonly logger = new AppLogger(TimeOffRequestService.name);

  constructor(
    @InjectRepository(TimeOffRequest)
    private timeOffRepo: Repository<TimeOffRequest>,
    @InjectRepository(SyncRecord)
    private syncRecordRepo: Repository<SyncRecord>,
    @InjectRepository(BalanceAuditLog)
    private auditLogRepo: Repository<BalanceAuditLog>,
    private leaveBalanceService: LeaveBalanceService,
  ) {}

  async createRequest(
    createDto: CreateTimeOffRequestDto,
  ): Promise<TimeOffRequest> {
    this.logger.log(
      `Creating time off request for employee ${createDto.employee_id}`,
      'TimeOffRequestService.createRequest',
    );

    const request = this.timeOffRepo.create({
      ...createDto,
      status: TimeOffStatus.PENDING,
      synced_to_hcm: false,
    });

    return this.timeOffRepo.save(request);
  }

  async getRequest(requestId: string): Promise<TimeOffRequest> {
    return this.timeOffRepo.findOne({
      where: { id: requestId },
    });
  }

  async getEmployeeRequests(employeeId: string): Promise<TimeOffRequest[]> {
    return this.timeOffRepo.find({
      where: { employee_id: employeeId },
      order: { created_at: 'DESC' },
    });
  }

  async getPendingRequests(): Promise<TimeOffRequest[]> {
    return this.timeOffRepo.find({
      where: { status: TimeOffStatus.PENDING },
      order: { created_at: 'ASC' },
    });
  }

  async approveRequest(
    requestId: string,
    approveDto: ApproveTimeOffRequestDto,
  ): Promise<TimeOffRequest> {
    this.logger.log(
      `Approving request ${requestId}`,
      'TimeOffRequestService.approveRequest',
    );

    const request = await this.getRequest(requestId);
    if (!request) {
      throw new Error('Request not found');
    }

    // Deduct from leave balance
    try {
      await this.leaveBalanceService.deductBalance(
        request.employee_id,
        request.leave_type,
        request.days_requested,
        `Time off request ${requestId}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to deduct balance: ${error.message}`,
        error.stack,
        'TimeOffRequestService.approveRequest',
      );
      throw error;
    }

    request.status = TimeOffStatus.APPROVED;
    request.approver_id = approveDto.approver_id;
    request.approval_date = new Date();
    request.approval_comment = approveDto.approval_comment;

    const updated = await this.timeOffRepo.save(request);

    // Queue for HCM sync
    await this.syncRecordRepo.save({
      sync_type: SYNC_TYPES.TIME_OFF_APPROVAL,
      time_off_request_id: requestId,
      status: 'pending',
      retry_count: 0,
    });

    return updated;
  }

  async rejectRequest(
    requestId: string,
    rejectDto: RejectTimeOffRequestDto,
  ): Promise<TimeOffRequest> {
    this.logger.log(
      `Rejecting request ${requestId}`,
      'TimeOffRequestService.rejectRequest',
    );

    const request = await this.getRequest(requestId);
    if (!request) {
      throw new Error('Request not found');
    }

    request.status = TimeOffStatus.REJECTED;
    request.approver_id = rejectDto.approver_id;
    request.approval_date = new Date();
    request.approval_comment = rejectDto.reason;

    return this.timeOffRepo.save(request);
  }

  async cancelRequest(requestId: string): Promise<TimeOffRequest> {
    this.logger.log(
      `Cancelling request ${requestId}`,
      'TimeOffRequestService.cancelRequest',
    );

    const request = await this.getRequest(requestId);
    if (!request) {
      throw new Error('Request not found');
    }

    // Restore balance if previously approved
    if (request.status === TimeOffStatus.APPROVED) {
      await this.leaveBalanceService.restoreBalance(
        request.employee_id,
        request.leave_type,
        request.days_requested,
        `Cancelled time off request ${requestId}`,
      );
    }

    request.status = TimeOffStatus.CANCELLED;
    return this.timeOffRepo.save(request);
  }

  async syncToHcm(requestId: string): Promise<SyncRecord> {
    const request = await this.getRequest(requestId);
    if (!request) {
      throw new Error('Request not found');
    }

    const syncRecord = await this.syncRecordRepo.findOne({
      where: {
        time_off_request_id: requestId,
        sync_type: SYNC_TYPES.TIME_OFF_APPROVAL,
      },
    });

    if (!syncRecord) {
      throw new Error('Sync record not found');
    }

    try {
      // Simulate HCM API call
      const hcmResponse = {
        success: true,
        message: 'Time off request synced successfully',
        hcm_id: `HCM-${requestId}`,
      };

      syncRecord.status = 'success';
      syncRecord.hcm_response = JSON.stringify(hcmResponse);
      request.synced_to_hcm = true;
      request.last_hcm_sync = new Date();
      request.hcm_record_id = hcmResponse.hcm_id;

      await this.timeOffRepo.save(request);
      return this.syncRecordRepo.save(syncRecord);
    } catch (error) {
      this.logger.error(
        `HCM sync failed: ${error.message}`,
        error.stack,
        'TimeOffRequestService.syncToHcm',
      );

      syncRecord.status = 'failed';
      syncRecord.error_message = error.message;
      syncRecord.retry_count += 1;
      syncRecord.retry_at = new Date(Date.now() + 5 * 60 * 1000); // Retry in 5 minutes

      await this.syncRecordRepo.save(syncRecord);
      throw new HcmServiceException(
        'Failed to sync with HCM system',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  async getUnsyncedRequests(): Promise<SyncRecord[]> {
    return this.syncRecordRepo.find({
      where: { status: 'pending' },
      order: { created_at: 'ASC' },
    });
  }
}
