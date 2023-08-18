import { UserType } from '@prisma/client';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  Matches,
  IsEnum,
  IsOptional,
} from 'class-validator';

export class SignupDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @Matches(/^(01[016789]{1})[0-9]{3,4}[0-9]{4}$/, {
    message: 'Phone number must be a valid phone number',
  })
  phone: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(5)
  password: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  storeKey?: string;
}

export class SigninDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(5)
  password: string;
}

export class GenerateStoreKeyDto {
  @IsEmail()
  email: string;

  @IsEnum(UserType)
  userType: UserType;
}
