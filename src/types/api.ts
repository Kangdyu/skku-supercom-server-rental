import { Server, User } from '@prisma/client';

export type UserDTO = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
export type ServerDTO = Omit<Server, 'id' | 'createdAt' | 'updatedAt'>;
