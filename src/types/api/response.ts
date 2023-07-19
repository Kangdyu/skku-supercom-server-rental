import { Reservation, Server, ServerAvailability } from '@prisma/client';

export interface ServerResponse extends Server {
  serverAvailability: ServerAvailability[];
  reservations: Reservation[];
}

export interface PaginationResponse<T> {
  pageSize: number;
  pageNumber: number;
  totalCount: number;
  totalPages: number;
  contents: T[];
}
