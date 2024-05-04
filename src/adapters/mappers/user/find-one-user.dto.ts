import { IsOptional } from 'class-validator';
import { FindOneDto } from '../common/find-one.dto';

export class FindOneUserDto extends FindOneDto {
  @IsOptional()
  readonly userName?: string;

  @IsOptional()
  readonly email?: string;

  @IsOptional()
  readonly phoneNumber?: string;
}
