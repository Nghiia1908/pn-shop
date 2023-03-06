import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExceptionResponseDetail } from 'src/utils.common/utils.exceptions.common/utils.exception-common';
import { ExceptionStoreProcedure } from 'src/utils.common/utils.exceptions.common/utils.store-procedure-exception.common';
import { Pagination } from 'src/utils.common/utils.pagination.common/utils.pagination.common';
import { StoreProcedureResult } from 'src/utils.common/utils.store-procedure-result.common/utils.store-procedure-result.common';
import { StoreProcedureResultInterface } from 'src/utils.common/utils.store-procedure-result.common/utils.store-procedure-result.interface.common';
import { Repository } from 'typeorm';
import { CreateSupplierDTO } from './supplier.dto/create.supplier.dto';
import { UpdateSupplierDTO } from './supplier.dto/update.supplier.dto';
import { Supplier } from './supplier.entity/supplier.entity';
import { SupplierStatusEnum } from './supplier.enum/supplier.status.enum';

@Injectable()
export class SupplierService {
    constructor(
        @InjectRepository(Supplier)
        private supplierRepository: Repository<Supplier>
    ){ }

    async createSupplier(createSupplierDTO : CreateSupplierDTO): Promise<Supplier>{

        let supplier : Supplier = new Supplier();

        supplier.name = createSupplierDTO.name
        supplier.description = createSupplierDTO.description
        supplier.email = createSupplierDTO.email
        supplier.phone_number = createSupplierDTO.phone_number
        supplier.status = SupplierStatusEnum.AVAILABLE

        
        
        await this.supplierRepository.create(supplier);
        await this.supplierRepository.save(supplier);

        console.log(supplier);
        return supplier;
    }

    async updateSupplier(id : number, updateSupplierDTO : UpdateSupplierDTO): Promise<Supplier>{
        let supplierById : Supplier = await this.findOneById(id);
        if(!supplierById){
            throw new HttpException(new ExceptionResponseDetail(HttpStatus.BAD_REQUEST, "Nhà cung cấp không tồn tại !"), HttpStatus.OK);
        }else{
            supplierById.name = updateSupplierDTO.name
            supplierById.description = updateSupplierDTO.description
            supplierById.email = updateSupplierDTO.email
            supplierById.phone_number = updateSupplierDTO.phone_number
            await this.update(supplierById)
        }
        return supplierById;
    }

    async findOneById(id: number): Promise<Supplier> {
        return await this.supplierRepository.findOneBy({ id});
      }

      async update(supplier: Supplier): Promise<Supplier> {
        return await this.supplierRepository.save(supplier);
    }

    async getListSupplier(key_search : string , status : number , pagination : Pagination): Promise<StoreProcedureResultInterface<Supplier>>{
        let result = await this.supplierRepository.query('CALL sp_get_list_supplier(?,?,?,?,@status,@message,@totalRecord); SELECT @status AS status, @message AS message, @totalRecord AS total_record',
        [
            key_search,
            status,
            pagination.getLimit(),
            pagination.getOffset()
        ]);
        ExceptionStoreProcedure.validate(result);
        let data: StoreProcedureResultInterface<Supplier> = new StoreProcedureResult<Supplier>().getResultPagination(result)

        return data;
    }
}
