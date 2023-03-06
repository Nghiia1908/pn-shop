import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity/users.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            secret: "1235sd-5656sdf-@dfkdf-sdsjfdj",
          }),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports:[UsersModule , UsersService]
})
export class UsersModule { }
