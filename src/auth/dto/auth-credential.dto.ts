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
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  )
  password: string;

  @IsString()
  @MinLength(8)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  )
  reTypePassword: string;
}
