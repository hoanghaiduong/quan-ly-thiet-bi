import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, Logger, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CorsConfig } from "./common/config/cors.config";
import { SwaggerConfig } from "./common/config/swagger.config";
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { initializeTransactionalContext } from "typeorm-transactional";
import { HttpExceptionFilter } from './common/exception/http-exception.filter';

async function bootstrap() {
  initializeTransactionalContext();

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
  });
  app.useBodyParser('json', { limit: '10mb' });

  const configService = app.get(ConfigService);



  app.setGlobalPrefix("api", { exclude: [""] });
  CorsConfig.enableCors(app);

  // Create an HTTP server to use with Socket.IO
  // const httpServer = createServer(app.getHttpAdapter().getInstance());

  // Configure Socket.IO with CORS
  // const io = new Server(httpServer, {
  //   cors: {
  //     origin: '*', // Replace with your frontend origin
  //     methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
  //   },
  // });
  // io.listen(configService.get<number>('port'))
  SwaggerConfig.init(app);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  // app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
  // cấu hình Serialization global nestjs class-transforms để ẩn các dữ liệu nhảy cảm truớc khi gửi về cho khách
  // -----  không được gửi password về
  // -----  @Exclude() trong entity
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  // Sử dụng middleware express.static để phục vụ các tệp tĩnh
  app.useStaticAssets(path.join(__dirname, '..', 'public')); // cấu hình thư mục chứa tài nguyên tĩnh
  app.setBaseViewsDir(path.join(__dirname, '..', 'views')); // cấu hình thư mục chứa các view template
  app.setViewEngine('hbs'); // cấu hình view engine sử dụng Handlebars
  // Logger.warn(path.join(__dirname, '..', 'public'))

  await app.listen(configService.get("PORT"), () => {
    Logger.log(
      `Listening at http://localhost:${configService.get<number>("PORT")}`,
    );
    Logger.log(
      `Document Listening at http://localhost:${configService.get<number>("PORT")}/api`,
    );
    Logger.log(
      "Running in environment " + configService.get<string>("NODE_ENV"),
    );
  });

}
bootstrap().then(() => Logger.log("Server started"));