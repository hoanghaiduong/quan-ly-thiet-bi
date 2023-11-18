import { INestApplication } from "@nestjs/common";

export class CorsConfig {
	public static enableCors(app: INestApplication) {
		app.enableCors({
			origin: "*",
			methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
			preflightContinue: false,
			optionsSuccessStatus: 204,
		});
	}
}
