import { Admin, Server } from '@prisma/client';

type CommonDBFields = 'id' | 'createdAt' | 'updatedAt';

export type AdminDTO = Omit<Admin, CommonDBFields>;
export type ServerDTO = Omit<Server, CommonDBFields>;

/**
 * @example dates: ['2023-1', '2023-12', ...]
 */
export interface ServerAvailabilityDTO {
  dates: string[];
}

export interface ReservationDTO {
  serverId: number;
  applicationFileUrl: string;
  dates: Date[];
}
