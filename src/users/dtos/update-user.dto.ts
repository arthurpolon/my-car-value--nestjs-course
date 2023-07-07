import { IsEmail, IsOptional, IsString, Length } from 'class-validator'

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  email: string

  @IsString()
  @Length(5)
  @IsOptional()
  password: string
}
