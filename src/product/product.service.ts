import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection,Repository } from 'typeorm';
import { Product } from './product.entity/product.entity';
import { Pagination } from 'src/utils.common/utils.pagination.common/utils.pagination.common';
import { stat } from 'fs';
import { ExceptionStoreProcedure } from 'src/utils.common/utils.exceptions.common/utils.store-procedure-exception.common';
import { ProductDetailDataModel } from './product.entity/product.detail.entity';
import { StoreProcedureResultInterface } from 'src/utils.common/utils.store-procedure-result.common/utils.store-procedure-result.interface.common';
import { StoreProcedureResult } from 'src/utils.common/utils.store-procedure-result.common/utils.store-procedure-result.common';
import { CreateProductDTO } from './product.dto/create.product.dto';
import { ProductStatusEnum } from './product.enum/product.status.enum';
import { UpdateProductDTO } from './product.dto/update.product.dto';
import { ExceptionResponseDetail } from 'src/utils.common/utils.exceptions.common/utils.exception-common';

@Injectable()
export class ProductService {

    constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>, 
    private connection: Connection
){ }

    async getListProduct(supplier_id: number , key_search : string , status : number , pagination : Pagination): Promise<StoreProcedureResultInterface<ProductDetailDataModel>>{
        let result = await this.productRepository.query('CALL sp_get_list_product(?,?,?,?,?,@status,@message,@totalRecord); SELECT @status AS status, @message AS message, @totalRecord AS total_record',
        [
            supplier_id,
            key_search,
            status,
            pagination.getLimit(),
            pagination.getOffset()
        ]);
        
        ExceptionStoreProcedure.validate(result);
        let data: StoreProcedureResultInterface<ProductDetailDataModel> = new StoreProcedureResult<ProductDetailDataModel>().getResultPagination(result)

        return data;
    }

    async getDetailProduct(product_id : number): Promise<ProductDetailDataModel>{

         let result: ProductDetailDataModel = null;
        // rollback Dữ liệu
        await this.connection.transaction(async manager => {
            result = await this.productRepository.query("CALL sp_get_detail_product(?,@status,@message) ; SELECT @status AS status , @message AS message",
                [
                    product_id
                ]);
            ExceptionStoreProcedure.validateEmptyDetail(result);
            result = new StoreProcedureResult<ProductDetailDataModel>().getResultDetail(result);
        });
        return result;
}

    async createProduct(createProductDTO : CreateProductDTO ) : Promise<Product>{

        let product : Product = new Product();

        product.supplier_id = createProductDTO.supplier_id
        product.name = createProductDTO.name
        product.description = createProductDTO.description
        product.quantity = createProductDTO.quantity
        product.amount = createProductDTO.amount
        product.discount_percent = createProductDTO.discount_percent
        product.discount_amount = createProductDTO.discount_amount
        product.status = ProductStatusEnum.AVAILABLE

        await this.productRepository.create(product);
        await this.productRepository.save(product);

        return product;
    }


    async updateProduct (product_id : number ,updateProductDTO : UpdateProductDTO  ) : Promise<Product>{

        let product : Product = await this.findOneById(product_id);
        if(product == null){
            throw new HttpException(new ExceptionResponseDetail(HttpStatus.BAD_REQUEST, "Sản phẩm không tồn tại !"), HttpStatus.OK);
        }
        product.name = updateProductDTO.name
        product.description = updateProductDTO.description
        product.quantity = updateProductDTO.quantity
        product.amount = updateProductDTO.amount
        product.discount_percent = updateProductDTO.discount_percent
        product.discount_amount = updateProductDTO.discount_amount

        await this.update(product)
        return product;
    }

    async findOneById(id: number): Promise<Product> {
        return await this.productRepository.findOneBy({ id});
      }

    async update(product: Product): Promise<Product> {
        return await this.productRepository.save(product);
    }


    // async createProduct( createProductDto : CreateProductDTO)

    // // async createProduct(product_name )

}
