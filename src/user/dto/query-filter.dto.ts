import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional } from "class-validator";

// Enum để định nghĩa các loại phép so sánh trong DTO filter
enum FilterColumnOperator {
  role = 'role',
  username = 'username',
  email = 'email',
  phoneNumber = 'phoneNumber',
  phoneNumber2 = 'phoneNumber2',
  address = 'address',
  zalo = 'zalo',
}

export class FilterUserDTO {
  @ApiPropertyOptional({ enum: FilterColumnOperator, default: FilterColumnOperator.username })
  @IsEnum(FilterColumnOperator)
  @IsOptional()
  column?: FilterColumnOperator = FilterColumnOperator.username;
}