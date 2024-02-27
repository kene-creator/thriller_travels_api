import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export abstract class GetUserByIdDto {
  @ApiProperty()
  @IsUUID()
  userId: string;
}
