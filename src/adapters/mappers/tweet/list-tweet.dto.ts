import { TweetType } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class ListTweetDto {
  @IsEnum(TweetType)
  @IsOptional()
  readonly type?: TweetType;

  @IsString()
  @IsOptional()
  readonly content?: string;
}
