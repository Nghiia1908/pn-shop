import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { Admin } from './admin.entity/admin.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Admin]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            secret: "1235sd-5656sdf-@dfkdf-sdsjfdj",
          }),
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService , AdminModule]
})
export class AdminModule {}
