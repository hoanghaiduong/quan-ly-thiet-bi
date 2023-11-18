import { User } from "src/user/entities/user.entity";


export interface AuthenticationRequest extends Request {
    user: User;
}