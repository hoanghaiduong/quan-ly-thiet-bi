import { IsString, IsEmail, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/common/enum/auth';

export class CreateUserDto {

  @ApiProperty({ example: 'john_doe', description: 'The username of the user.' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'password123', description: 'The password of the user.' })
  @IsString()
  password: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'The email of the user.' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: true, description: 'The gender of the user.' })
  @IsOptional()
  @IsBoolean()
  gender?: boolean;

  @ApiProperty({ example: 'avatar.jpg', description: 'The avatar of the user.' })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({ example: '123456789', description: 'The phone number of the user.' })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiProperty({ example: 'refresh_token', description: 'The refresh token of the user.' })
  @IsOptional()
  @IsString()
  refreshToken?: string;
  @ApiProperty({
    required: false,
    example: 'fullname',
  })
  fullName?: string;

  @ApiProperty({ example: '123 Main St', description: 'The address of the user.' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: '987654321', description: 'The secondary phone number of the user.' })
  @IsOptional()
  @IsString()
  phoneNumber2?: string;

  @ApiProperty({ example: 'zalo_username', description: 'The Zalo username of the user.' })
  @IsOptional()
  @IsString()
  zalo?: string;

  @ApiProperty({ example: true, description: 'Whether the user is active.' })
  @IsBoolean()
  @IsOptional()
  isActived?: boolean;

  @ApiProperty({ example: false, description: 'Whether the user is deleted.' })
  @IsBoolean()
  @IsOptional()
  isDeleted?: boolean;

  @IsOptional()
  role?: Role;
}
