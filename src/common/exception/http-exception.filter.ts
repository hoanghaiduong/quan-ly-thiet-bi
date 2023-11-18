import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { ApiException } from "./api.exception";
import { Response } from "express";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
	catch(exception: HttpException, host: ArgumentsHost) {
		const { getResponse } = host.switchToHttp();
		const response: Response = getResponse();
		const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

		if (exception instanceof ApiException) {
			response.status(status).json({
				code: exception.code,
				message: exception.message
			});
		} else if (exception instanceof BadRequestException) {
			const errors = exception.getResponse()["message"];
			const message = Array.isArray(errors) ? errors[0] : errors;
			response.status(status).json({
				code: "BAD_REQUEST",
				message: message
			});
		} else {
			response.status(status).json({
				code: exception.name.replace(/([A-Z])/g, "_$1").toUpperCase().replace(/^_/, "").replace(/_EXCEPTION$/, ""),
				message: exception.message
			});
		}
	}
}
