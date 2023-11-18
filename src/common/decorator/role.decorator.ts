import { applyDecorators, SetMetadata, UseGuards } from "@nestjs/common";
import {RolesGuard} from "../../auth/guard/role.guard";


export const Roles = (...role: string[]) => {
	return applyDecorators(SetMetadata("roles", role), UseGuards(RolesGuard));
};
