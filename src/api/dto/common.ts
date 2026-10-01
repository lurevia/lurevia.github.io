export type PaginationDto = {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type PaginatedDto<T> = {
  items: T[];
  pagination: PaginationDto;
};
