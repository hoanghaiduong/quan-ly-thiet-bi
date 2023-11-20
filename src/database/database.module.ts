import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                // return {
                //     type: 'mssql',
                //     port: configService.get<number>("SQL_PORT"),
                //     host: configService.get<string>("SQL_HOST"),
                //     username: configService.get<string>("SQL_USER"),
                //     password: configService.get<string>("SQL_PASSWORD"),
                //     database: configService.get<string>("SQL_DB"),
                //     entities: [__dirname + "/**/*.entity{.ts,.js}"],
                //     synchronize: true,
                //     options: {
                //         encrypt: false
                //     },
                //     logging: true,
                //     autoLoadEntities: true,
                // }
                return {
                    type: 'postgres',
                    port: configService.get<number>("POSTGRES_PORT"),
                    host: configService.get<string>("POSTGRES_HOST"),
                    username: configService.get<string>("POSTGRES_USER"),
                    password: configService.get<string>("POSTGRES_PASSWORD"),
                    database: configService.get<string>("POSTGRES_DB"),
                    entities: [__dirname + "/**/*.entity{.ts,.js}"],
                    synchronize: true,
                    logging: true,
                    autoLoadEntities: true,
                    dateStrings: ['DATE', 'DATETIME'],
                    timezone: 'Asia/Ho_Chi_Minh', // Đặt múi giờ Việt Nam (Hồ Chí Minh)
                }
            },
            async dataSourceFactory(options) {
                if (!options) {
                    throw new Error('Invalid options passed');
                }
                return addTransactionalDataSource(new DataSource(options));
            },
        })
    ],
    exports: [DatabaseModule]
})
export class DatabaseModule { }
