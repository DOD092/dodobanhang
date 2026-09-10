import { ValueTransformer } from 'typeorm';

/**
 * Postgres numeric/decimal được driver `pg` trả về dạng string để không mất
 * độ chính xác. Transformer này ép về number khi đọc entity, giúp DTO và
 * response JSON luôn là số.
 */
export class NumericTransformer implements ValueTransformer {
  to(value?: number | null): number | null | undefined {
    return value;
  }

  from(value?: string | null): number | null | undefined {
    if (value === null || value === undefined) {
      return value;
    }
    return Number(value);
  }
}

export const numericTransformer = new NumericTransformer();
