import { ApiResponseProperty } from '@nestjs/swagger';

export class AuthResponse {
  @ApiResponseProperty()
  accessToken: string;

  @ApiResponseProperty()
  accessTokenExpirationDate: number;

  @ApiResponseProperty()
  userId: string;
}
