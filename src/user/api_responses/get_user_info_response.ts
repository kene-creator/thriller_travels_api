import { ApiResponseProperty } from '@nestjs/swagger';

export class GetUserInfosResponseAPI {
  @ApiResponseProperty()
  id: string;

  @ApiResponseProperty()
  firstname: string;

  @ApiResponseProperty()
  tel: string;
}
