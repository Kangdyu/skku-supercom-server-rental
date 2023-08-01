import {
  Admin,
  Reservation,
  ReservationDate,
  Server,
  ServerAvailability,
  User,
} from '@prisma/client';

export type AdminResponse = Omit<Admin, 'password'>;

export interface ServerResponse extends Server {
  serverAvailability: ServerAvailability[];
  reservations: Reservation[];
}

export interface ReservationResponse extends Reservation {
  reservationDates: ReservationDate[];
  server: Server;
  user: User;
}

export interface PaginationResponse<T> {
  pageSize: number;
  pageNumber: number;
  totalCount: number;
  totalPages: number;
  contents: T[];
}
