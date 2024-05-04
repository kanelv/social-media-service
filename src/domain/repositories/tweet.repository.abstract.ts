import { Prisma, Tweet } from '@prisma/client';
import { FindOneTweetDto, ListTweetDto } from '../../adapters/mappers/tweet';

export abstract class AbstractTweetRepository {
  abstract upsertMany(
    upsertManyInput: Prisma.TweetUncheckedCreateInput[]
  ): Promise<Prisma.BatchPayload>;

  abstract list(query: ListTweetDto): Promise<Tweet[]>;

  abstract get(query: FindOneTweetDto): Promise<Tweet>;
}
