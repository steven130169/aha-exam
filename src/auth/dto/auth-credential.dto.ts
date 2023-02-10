import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class AuthCredentialDto {
  @IsEmail()
  email: string;
  // contains at least one lower character
  // contains at least one upper character
  // contains at least one digit character
  // contains at least one special character
  // contains at least 8 characters
  @IsString()
  @MinLength(8)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+\-=<>.,|])[A-Za-z\d~!@#$%^&*()_+\-=<>.,|]{8,}$/,
    {
      message:
        'Your password need at least one lower character, ' +
        'at least one upper character, ' +
        'at least one digit character, ' +
        'at least one special character, ' +
        'at least 8 characters',
    },
  )
  password: string;

  retypePassword: string;
}
