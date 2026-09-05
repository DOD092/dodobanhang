import { HttpStatus } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

/**
 * Lỗi ràng buộc của Postgres mặc định rơi vào 500. Mapper này dịch các mã lỗi
 * hay gặp nhất thành HTTP 4xx kèm thông báo đọc được.
 * Mã lỗi: https://www.postgresql.org/docs/current/errcodes-appendix.html
 */
type PostgresError = QueryFailedError & {
  code?: string;
  detail?: string;
  table?: string;
  constraint?: string;
};

export interface MappedDatabaseError {
  statusCode: number;
  message: string;
  error: string;
}

export function mapDatabaseError(
  exception: unknown,
): MappedDatabaseError | null {
  if (!(exception instanceof QueryFailedError)) {
    return null;
  }

  const err = exception as PostgresError;
  const fallback = err.detail ?? err.message;

  switch (err.code) {
    // foreign_key_violation: FK trỏ tới bản ghi không tồn tại, hoặc xoá bản ghi
    // cha đang được tham chiếu (ON DELETE RESTRICT)
    case '23503':
      return {
        statusCode: HttpStatus.CONFLICT,
        error: 'ForeignKeyViolation',
        message: fallback,
      };
    case '23505': // unique_violation
      return {
        statusCode: HttpStatus.CONFLICT,
        error: 'UniqueViolation',
        message: fallback,
      };
    case '23502': // not_null_violation
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        error: 'NotNullViolation',
        message: fallback,
      };
    case '23514': // check_violation
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        error: 'CheckViolation',
        message: fallback,
      };
    case '22P02': // invalid_text_representation (vd. uuid sai định dạng)
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        error: 'InvalidInput',
        message: fallback,
      };
    default:
      return null;
  }
}
