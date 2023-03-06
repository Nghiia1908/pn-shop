import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminModule } from 'src/admin/admin.module';
import { User } from 'src/users/users.entity/users.entity';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

@Module
(
  {
    imports: [UsersModule,
    AdminModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([User]),],
    controllers: [AuthController],
    providers: [AuthService,JwtStrategy],
    exports: [JwtStrategy,AuthService]
  }
)
export class AuthModule {}
