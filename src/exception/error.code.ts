import { HttpStatus } from "@nestjs/common";
import { IError } from "../common/interface";


type ErrorFactory = (status: HttpStatus, message?: string) => IError;

const errorFactory: ErrorFactory = (status: HttpStatus, message?: string) => ({
    code: message?.toUpperCase().replace(/ /g, "_"),
    message,
    status
});
export const ErrorMessages = {
    REFRESH_TOKEN_INVALID: errorFactory(HttpStatus.UNAUTHORIZED, "Refresh token invalid"),
    REFRESH_TOKEN_EXPIRED: errorFactory(HttpStatus.UNAUTHORIZED, "Refresh token expired"),
    INVALID_TOKEN: errorFactory(HttpStatus.UNAUTHORIZED, "Invalid token"),
    TOKEN_EXPIRED: errorFactory(HttpStatus.UNAUTHORIZED, "Token expired"),
    USER_ALREADY_EXIST: errorFactory(HttpStatus.BAD_REQUEST, "User already exist"),
    PERMISSION_EXIST: errorFactory(HttpStatus.BAD_REQUEST, "Permission already exist"),
    GROUP_NOT_FOUND: errorFactory(HttpStatus.BAD_REQUEST, "Group not found"),
    USER_NOT_FOUND: errorFactory(HttpStatus.BAD_REQUEST, "User not found"),
    BAD_REQUEST: errorFactory(HttpStatus.BAD_REQUEST),

};
