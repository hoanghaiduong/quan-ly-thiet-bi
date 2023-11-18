import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { UpdateUserDto } from './update-user.dto';

export class UpdateUserProfileDto extends PartialType(OmitType(UpdateUserDto,['username','password','email'])) {
    
}
