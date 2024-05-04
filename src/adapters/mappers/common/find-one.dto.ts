import { IsOptional, IsString } from 'class-validator';

export class FindOneDto {
  @IsString()
  @IsOptional()
  readonly id?: string;
}
