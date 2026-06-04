import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppLogger extends Logger {
  debug(message: string, context?: string, meta?: any) {
    if (process.env.NODE_ENV === 'development') {
      super.debug(message, context);
      if (meta) {
        console.debug(meta);
      }
    }
  }

  log(message: string, context?: string, meta?: any) {
    super.log(message, context);
    if (meta && process.env.NODE_ENV === 'development') {
      console.log(meta);
    }
  }

  error(message: string, trace?: string, context?: string) {
    super.error(message, trace, context);
  }

  warn(message: string, context?: string, meta?: any) {
    super.warn(message, context);
    if (meta && process.env.NODE_ENV === 'development') {
      console.warn(meta);
    }
  }
}
