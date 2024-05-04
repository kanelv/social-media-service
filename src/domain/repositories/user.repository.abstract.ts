import { Prisma, User } from '@prisma/client';
import { FindOneUserDto } from '../../adapters/mappers/user';
import { ListUserDto } from '../../adapters/mappers/user/list-user.dto';

export type UserUpsertInput = Prisma.UserUncheckedCreateInput & {
  conflict: {
    userName: string;
    email: string;
    phoneNumber: string;
  };
};

export abstract class AbstractUserRepository {
  abstract upsertMany(
    upsertManyInput: UserUpsertInput[]
  ): Promise<Prisma.BatchPayload>;

  abstract list(query: ListUserDto): Promise<User[]>;

  abstract get(query: FindOneUserDto): Promise<User>;
}
