import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity'; //Importa a entidade User
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { DeclarationService } from './declaration/declaration.service';
import { DeclarationController } from './declaration/declaration.controller';
import { RequestService } from './request/request.service';
import { RequestController } from './request/request.controller';
import { DeclarationModule } from './declaration/declaration.module';
import { RequestModule } from './request/request.module';
import { DeclarationsModule } from './declarations/declarations.module';
import { DeclarationModule } from './declaration/declaration.module';
import { RequestModule } from './request/request.module';
import { DeclarationModule } from './declaration/declaration.module';
import { DeclarationModule } from './declaration/declaration.module';
import { DeclarationsModule } from './declarations/declarations.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [User],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    DeclarationModule,
    RequestModule,
    DeclarationsModule,
  ],
  providers: [DeclarationService, RequestService],
  controllers: [DeclarationController, RequestController],
})
export class AppModule {}
