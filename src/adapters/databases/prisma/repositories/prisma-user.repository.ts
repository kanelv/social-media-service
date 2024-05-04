import { Injectable, Logger } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import {
  AbstractUserRepository,
  UserUpsertInput
} from '../../../../domain/repositories';
import { FindOneUserDto, ListUserDto } from '../../../mappers/user';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaUserRepository implements AbstractUserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  readonly logger = new Logger(PrismaUserRepository.name);

  async upsertMany(users: UserUpsertInput[]): Promise<Prisma.BatchPayload> {
    try {
      const results = await this.prismaService.prisma.$transaction(
        users.map((user) =>
          this.prismaService.prisma.user.upsert({
            where: { email: user.email, userName: user.userName },
            update: user,
            create: user
          })
        )
      );
      return { count: results.length };
    } catch (error) {
      throw new Error('Unexpected error happened during upserting User');
    }
  }

  async list(query: ListUserDto): Promise<User[]> {
    const users: User[] = await this.prismaService.prisma.user.findMany({
      where: {
        role: query?.role
      }
    });

    return users;
  }

  async get(query: FindOneUserDto): Promise<User> {
    try {
      const user: User = await this.prismaService.prisma.user.findUnique({
        where: {
          userName: query?.userName,
          email: query?.email,
          phoneNumber: query?.phoneNumber
        }
      });

      if (!user) {
        throw new Error(`User with query ${query} was not found in Bidders DB`);
      }

      return user;
    } catch (error) {
      throw new Error(
        `Unexpected error happened during getting User by query: ${query}`
      );
    }
  }
}
