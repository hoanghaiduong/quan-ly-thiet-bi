import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Reflector } from "@nestjs/core";

@Injectable()
export class RefreshAuthGuard extends AuthGuard("refresh") {
    constructor(private reflector: Reflector) {
        super();
    }
}
