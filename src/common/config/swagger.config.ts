import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { INestApplication } from "@nestjs/common";

export class SwaggerConfig {
    public static init(app: INestApplication) {
        const options = new DocumentBuilder()
            .setTitle("Web  API")
            .setDescription("Web  API description")
            .setVersion("3.0")
            .addBearerAuth(
                { type: "http", scheme: "bearer", bearerFormat: "JWT" },
                "Authorization",
            )
            .addSecurityRequirements("Authorization")
            .build();
        const document = SwaggerModule.createDocument(app, options);
        SwaggerModule.setup("api", app, document, {
            swaggerOptions: {
                // save token
                persistAuthorization: true,
            }
        });
    }
}
