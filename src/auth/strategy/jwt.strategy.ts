import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthService, IJwtPayload } from "../auth.service";
import { ConfigService } from "@nestjs/config";
import { User } from "src/user/entities/user.entity";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly authService: AuthService,
        private configService: ConfigService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get<string>("JWT_SECRET"),
        });
    }

    async validate(payload: IJwtPayload): Promise<User> {
        const user = await this.authService.validateJwt(payload);
        if (!user) throw new UnauthorizedException();
        return user;
    }

}
