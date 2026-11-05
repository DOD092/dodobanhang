import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { IMailService } from '../../module/mail/interface/mail-service.interface';
import { mapDatabaseError } from './database-error.mapper';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  // Filter được tạo bằng `new` trong main.ts nên mail service truyền tay vào.
  constructor(private readonly mailService?: IMailService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Lỗi ràng buộc DB (FK, unique, check...) phải là 4xx chứ không phải 500
    const databaseError = mapDatabaseError(exception);
    if (databaseError) {
      response.status(databaseError.statusCode).json({
        ...databaseError,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
      return;
    }

    const isHttpException = exception instanceof HttpException;
    const statusCode = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse = isHttpException
      ? exception.getResponse()
      : 'Internal server error';

    // Chỉ lỗi 5xx mới là lỗi của server; 4xx là lỗi phía client, không cần báo.
    if (statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `${request.method} ${request.url}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
      // Không await: gửi mail chạy nền, không làm chậm response trả cho client.
      void this.mailService?.sendErrorAlert(exception, {
        method: request.method,
        path: request.originalUrl ?? request.url,
        statusCode,
        userId: (request as Request & { user?: { id?: string } }).user?.id,
      });
    }

    const message =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : ((exceptionResponse as Record<string, unknown>).message ?? exception);

    response.status(statusCode).json({
      statusCode,
      message,
      error: isHttpException ? exception.name : 'InternalServerError',
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
