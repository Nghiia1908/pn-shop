import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupplierController } from './supplier.controller';
import { Supplier } from './supplier.entity/supplier.entity';
import { SupplierService } from './supplier.service';


@Module({
  imports: [TypeOrmModule.forFeature([Supplier]),
  PassportModule.register({ defaultStrategy: 'jwt' }),
  JwtModule.register({
    secret: "1235sd-5656sdf-@dfkdf-sdsjfdj",
  }),
    SupplierModule
  ],
  providers: [SupplierService],
  controllers: [SupplierController],
  exports : [SupplierService]
})
export class SupplierModule {}