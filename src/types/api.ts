import { Server, ServerAvailability, User } from '@prisma/client';

type CommonDBFields = 'id' | 'createdAt' | 'updatedAt';

export type UserDTO = Omit<User, CommonDBFields>;
export type ServerDTO = Omit<Server, CommonDBFields>;
/**
 * @example dates: ['2023-1', '2023-12', ...]
 */
export interface ServerAvailabilityDTO {
  dates: string[];
}

export interface ReservationDTO {
  serverId: number;
  userId: number;
  dates: Date[];
}
