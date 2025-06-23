import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: "Email de l'utilisateur",
    example: 'user@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({
    description: "Mot de passe de l'utilisateur",
    example: 'password123',
  })
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}

export class RegisterDto {
  @ApiProperty({
    description: "Email de l'utilisateur",
    example: 'user@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({
    description: "Nom d'utilisateur",
    example: 'johndoe',
  })
  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @ApiProperty({
    description: 'Mot de passe (minimum 6 caractères)',
    example: 'password123',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  readonly password: string;
}
