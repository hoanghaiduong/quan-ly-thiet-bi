import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { AuthenticationRequest } from "../interface";

export const AuthUser = createParamDecorator(
    (data: string, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest<AuthenticationRequest>();
        return data ? request.user?.[data] : request.user;
    },
);
