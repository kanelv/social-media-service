import { TweetType } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateTweetDto {
  @IsEnum(TweetType)
  @IsOptional()
  readonly type?: TweetType;

  @IsString()
  @IsOptional()
  readonly content: string;
}
