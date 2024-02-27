import { ApiProperty } from '@nestjs/swagger';

import { IsEmail, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @Length(8, 16)
  password: string;
}
