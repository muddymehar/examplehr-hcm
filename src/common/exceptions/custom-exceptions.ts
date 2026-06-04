import { HttpException, HttpStatus } from '@nestjs/common';

export class OptimisticLockException extends HttpException {
  constructor(message = 'Resource version conflict - optimistic lock failed') {
    super(
      {
        statusCode: HttpStatus.CONFLICT,
        message,
        error: 'Conflict',
      },
      HttpStatus.CONFLICT,
    );
  }
}

export class HcmServiceException extends HttpException {
  constructor(
    message = 'HCM service error',
    statusCode = HttpStatus.SERVICE_UNAVAILABLE,
  ) {
    super(
      {
        statusCode,
        message,
        error: 'Service Unavailable',
      },
      statusCode,
    );
  }
}

export class InsufficientBalanceException extends HttpException {
  constructor(message = 'Insufficient leave balance') {
    super(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        message,
        error: 'Bad Request',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
