import { Body, Controller, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Query, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Pagination } from 'src/utils.common/utils.pagination.common/utils.pagination.common';
import { BaseListResponseData } from 'src/utils.common/utils.response.common/utils.base-list-response.common';
import { ResponseData } from 'src/utils.common/utils.response.common/utils.response.common';
import { StoreProcedureResultInterface } from 'src/utils.common/utils.store-procedure-result.common/utils.store-procedure-result.interface.common';
import { ProductDetailDataModel } from './product.entity/product.detail.entity';
import { ProductService } from './product.service';
import { Response } from 'express';
import { ProductDTO } from './product.dto/product.list.dto';
import { ProductDataResponse } from './product.response/product.list.response';
import { AuthGuard } from '@nestjs/passport';
import { GetAdminFromToken, GetUserFromToken } from 'src/utils.common/utils.decorators.common/utils.decorators.common';
import { User } from 'src/users/users.entity/users.entity';
import { CreateProductDTO } from './product.dto/create.product.dto';
import { ExceptionResponseDetail } from 'src/utils.common/utils.exceptions.common/utils.exception-common';
import { Product } from './product.entity/product.entity';
import { ProductResponse } from './product.response/product.response';
import { UpdateProductDTO } from './product.dto/update.product.dto';
import { Admin } from 'typeorm';

@Controller('api/product')
export class ProductController {

    constructor( 
        private productService : ProductService
        ){}

        
    @Get("")
    @UsePipes(new ValidationPipe({ transform: true }))
    async spGetListSalePosts(@Query() productDTO: ProductDTO, @Res() res: Response): Promise<any> {
        let response: ResponseData = new ResponseData();
        let pagination: Pagination = new Pagination(productDTO.page, productDTO.limit);
        let salePostListDataModel: StoreProcedureResultInterface<ProductDetailDataModel> = await this.productService.getListProduct(productDTO.supplier_id,
            productDTO.key_search,
            productDTO.status,
            pagination);
            
        response.setData(new BaseListResponseData<ProductDetailDataModel>(new ProductDataResponse().mapToList(salePostListDataModel.data), pagination.limit, salePostListDataModel.total_record))
        return res.status(HttpStatus.OK).send(response);
    }

    @Get("/:id/detail")
    @UseGuards(AuthGuard())
    @UsePipes(new ValidationPipe({ transform: true }))
    async spGetSalePostDetail(@Param('id', ParseIntPipe) salePostId: number, @GetUserFromToken() user: User, @Res() res: Response): Promise<any> {
        let response: ResponseData = new ResponseData();
        if(!user) {
            throw new HttpException(new ExceptionResponseDetail(HttpStatus.FORBIDDEN, `Khách hàng Không hợp lệ!`), HttpStatus.OK);
        }
        else{
            let salePostDataModel: ProductDetailDataModel = await this.productService.getDetailProduct(salePostId);
            response.setData(new ProductDataResponse(salePostDataModel));
            return res.status(HttpStatus.OK).send(response)
        }
        
    }

    @Post("/create")
    @UseGuards(AuthGuard())
    @UsePipes()
    async create(@Body(new ValidationPipe()) createProductDTO: CreateProductDTO,  @GetAdminFromToken() adminToken: Admin, @Res() res: Response): Promise<any> {
        let response: ResponseData = new ResponseData();
        if(!adminToken){
            throw new HttpException(new ExceptionResponseDetail(HttpStatus.FORBIDDEN, `Không có quyền truy cập !`), HttpStatus.OK);
        }
        let product : Product = await this.productService.createProduct(createProductDTO);
        response.setData(new ProductResponse(product))
        return res.status(HttpStatus.OK).send(response);
    }

    @Post("/:id/update")
    @UseGuards(AuthGuard())
    @UsePipes()
    async update( @Param('id', ParseIntPipe) productId: number, @Body(new ValidationPipe()) updateProductDTO: UpdateProductDTO , @GetAdminFromToken() adminToken: Admin, @Res() res: Response): Promise<any> {
        let response: ResponseData = new ResponseData();
        if(!adminToken){
            throw new HttpException(new ExceptionResponseDetail(HttpStatus.FORBIDDEN, `Không có quyền truy cập !`), HttpStatus.OK);
        }
       let product : Product = await this.productService.updateProduct(productId ,updateProductDTO);
       response.setData(new ProductResponse(product))
        return res.status(HttpStatus.OK).send(response);
    }

}
