export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginationResult<T> {
  page: number;
  limit: number;
  total: number;
  data: T[];
}

export function getPagination({ page = 1, limit = 20 }: PaginationParams) {
  const clampedLimit = Math.max(1, Math.min(100, limit));
  const skip = (Math.max(1, page) - 1) * clampedLimit;
  return { limit: clampedLimit, skip };
}
