import { UserRole } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';

export class ListUserDto {
  @IsEnum(UserRole)
  @IsOptional()
  readonly role?: UserRole;
}
