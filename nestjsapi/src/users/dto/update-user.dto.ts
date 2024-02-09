import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsNotEmpty()
  @IsString()
  @Length(2, 255)
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 255)
  password: string;
}
