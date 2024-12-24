import { User } from "@prisma/client";

export type ICreateUser = Pick<User, 'name' | 'username' | 'role' | 'password'>
export type IUpdateUser = Partial<Pick<User, 'name' | 'username' | 'role' | 'password'>>;
