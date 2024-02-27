import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SignUpDTO {
  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsString()
  password: string;
}
