import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TimeOffRequestService } from '../services/time-off-request.service';
import {
  CreateTimeOffRequestDto,
  ApproveTimeOffRequestDto,
  RejectTimeOffRequestDto,
  TimeOffRequestResponseDto,
} from '../dtos/time-off-request.dto';

@Controller('api/time-off')
export class TimeOffRequestController {
  constructor(private readonly timeOffService: TimeOffRequestService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createRequest(
    @Body() createDto: CreateTimeOffRequestDto,
  ): Promise<TimeOffRequestResponseDto> {
    return this.timeOffService.createRequest(createDto);
  }

  @Get('requests/:requestId')
  async getRequest(
    @Param('requestId') requestId: string,
  ): Promise<TimeOffRequestResponseDto> {
    return this.timeOffService.getRequest(requestId);
  }

  @Get('employee/:employeeId')
  async getEmployeeRequests(
    @Param('employeeId') employeeId: string,
  ): Promise<TimeOffRequestResponseDto[]> {
    return this.timeOffService.getEmployeeRequests(employeeId);
  }

  @Get('pending')
  async getPendingRequests(): Promise<TimeOffRequestResponseDto[]> {
    return this.timeOffService.getPendingRequests();
  }

  @Post('requests/:requestId/approve')
  async approveRequest(
    @Param('requestId') requestId: string,
    @Body() approveDto: ApproveTimeOffRequestDto,
  ): Promise<TimeOffRequestResponseDto> {
    return this.timeOffService.approveRequest(requestId, approveDto);
  }

  @Post('requests/:requestId/reject')
  async rejectRequest(
    @Param('requestId') requestId: string,
    @Body() rejectDto: RejectTimeOffRequestDto,
  ): Promise<TimeOffRequestResponseDto> {
    return this.timeOffService.rejectRequest(requestId, rejectDto);
  }

  @Post('requests/:requestId/cancel')
  async cancelRequest(
    @Param('requestId') requestId: string,
  ): Promise<TimeOffRequestResponseDto> {
    return this.timeOffService.cancelRequest(requestId);
  }

  @Post('requests/:requestId/sync-hcm')
  async syncToHcm(@Param('requestId') requestId: string) {
    return this.timeOffService.syncToHcm(requestId);
  }

  @Get('sync/unsynced')
  async getUnsyncedRequests() {
    return this.timeOffService.getUnsyncedRequests();
  }
}
