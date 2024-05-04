import { Injectable } from '@nestjs/common';
import { Prisma, Tweet } from '@prisma/client';
import { AbstractTweetRepository } from '../../../../domain/repositories';
import { FindOneTweetDto, ListTweetDto } from '../../../mappers/tweet';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaTweetRepository implements AbstractTweetRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async upsertMany(
    tsoRequestUpsertManyInput: Prisma.TweetUncheckedCreateInput[]
  ): Promise<Prisma.BatchPayload> {
    try {
      return await this.prismaService.prisma.$transaction(async (tx) => {
        const upsertPromises = tsoRequestUpsertManyInput.map(
          async (tsoRequest) => {
            return tx.tweet.upsert({
              update: tsoRequest,
              create: tsoRequest,
              where: undefined
            });
          }
        );

        const results = await Promise.all(upsertPromises);

        return { count: results.length };
      });
    } catch (error) {
      throw new Error('Unexpected error happened during upserting Tweet');
    }
  }

  async list(listDto: ListTweetDto): Promise<Tweet[]> {
    try {
      const query: Prisma.TweetWhereInput = { ...listDto };

      return this.prismaService.prisma.tweet.findMany({
        where: query
      });
    } catch (error) {
      throw new Error('Unexpected error happened during listing TsoRequests');
    }
  }

  async get(query: FindOneTweetDto): Promise<Tweet> {
    try {
      const foundTsoRequest = await this.prismaService.prisma.tweet.findUnique({
        where: {
          id: query?.id
        }
      });

      if (!foundTsoRequest) {
        throw new Error(
          `TsoRequest was not found for query: ${query} in Social Media Service DB`
        );
      }
      return foundTsoRequest;
    } catch (error) {
      throw new Error(
        `Unexpected error happened during getting TsoRequest by query: ${query}`
      );
    }
  }
}
