import { ApiResponseProperty } from '@nestjs/swagger';

class ProfileType {
  @ApiResponseProperty()
  description?: string | null;
}

export class UserProfile {
  @ApiResponseProperty()
  userId: string;

  @ApiResponseProperty()
  firstname: string;

  @ApiResponseProperty()
  lastname: string;

  @ApiResponseProperty()
  tel: string;

  @ApiResponseProperty()
  email: string;

  @ApiResponseProperty()
  address: string;

  @ApiResponseProperty()
  profile: ProfileType;
}

export class GetUserResponseAPI {
  @ApiResponseProperty({ type: () => UserProfile })
  user: UserProfile;
}
