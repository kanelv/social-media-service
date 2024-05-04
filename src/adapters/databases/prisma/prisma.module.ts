import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  AbstractTweetRepository,
  AbstractUserRepository
} from '../../../domain/repositories';
import { PrismaService } from './prisma.service';
import { PrismaTweetRepository } from './repositories/prisma-tweet.repository';
import { PrismaUserRepository } from './repositories/prisma-user.repository';

@Module({
  imports: [ConfigModule],
  providers: [
    PrismaService,
    {
      provide: AbstractUserRepository,
      useClass: PrismaUserRepository
    },
    {
      provide: AbstractTweetRepository,
      useClass: PrismaTweetRepository
    }
  ],
  exports: [PrismaService, AbstractUserRepository, AbstractTweetRepository]
})
export class PrismaModule {}
