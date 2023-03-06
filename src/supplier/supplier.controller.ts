import { Body, Controller, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Query, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Pagination } from 'src/utils.common/utils.pagination.common/utils.pagination.common';
import { BaseListResponseData } from 'src/utils.common/utils.response.common/utils.base-list-response.common';
import { ResponseData } from 'src/utils.common/utils.response.common/utils.response.common';
import { StoreProcedureResultInterface } from 'src/utils.common/utils.store-procedure-result.common/utils.store-procedure-result.interface.common';
import { ListSupplierDTO } from './supplier.dto/list.supplier.dto';
import { Response } from 'express';
import { Supplier } from './supplier.entity/supplier.entity';
import { SupplierDataResponse } from './supplier.response/supplier.list.response';
import { SupplierService } from './supplier.service';
import { CreateSupplierDTO } from './supplier.dto/create.supplier.dto';
import { UpdateSupplierDTO } from './supplier.dto/update.supplier.dto';
import { GetAdminFromToken, GetUserFromToken } from 'src/utils.common/utils.decorators.common/utils.decorators.common';
import { User } from 'src/users/users.entity/users.entity';
import { ExceptionResponseDetail } from 'src/utils.common/utils.exceptions.common/utils.exception-common';
import { AuthGuard } from '@nestjs/passport';
import { SupplierStatusEnum } from './supplier.enum/supplier.status.enum';
import { Admin } from 'typeorm';

@Controller('api/supplier')
export class SupplierController {
    constructor( 
        private supplierService : SupplierService
        ){}


        @Get("")
        @UsePipes(new ValidationPipe({ transform: true }))
        async spGetListSupplier(@Query() listSupplierDTO: ListSupplierDTO, @Res() res: Response): Promise<any> {
            
            let response: ResponseData = new ResponseData();
            let pagination: Pagination = new Pagination(listSupplierDTO.page, listSupplierDTO.limit);
            let supplier: StoreProcedureResultInterface<Supplier> = await this.supplierService.getListSupplier(
                listSupplierDTO.key_search,
                listSupplierDTO.status,
                pagination
            )
            response.setData(new BaseListResponseData<Supplier>(new SupplierDataResponse().mapToList(supplier.data), pagination.limit, supplier.total_record))
            return res.status(HttpStatus.OK).send(response);
        }


        @Post("/create")
        @UseGuards(AuthGuard())
        @UsePipes()
        async create(@Body(new ValidationPipe()) createSupplierDTO: CreateSupplierDTO, @GetAdminFromToken() adminToken: Admin, @Res() res: Response): Promise<any> {
            let response: ResponseData = new ResponseData();
            if(!adminToken){
                throw new HttpException(new ExceptionResponseDetail(HttpStatus.FORBIDDEN, `Không có quyền truy cập !`), HttpStatus.OK);
            }
           let supplier : Supplier = await this.supplierService.createSupplier(createSupplierDTO);
           response.setData(new SupplierDataResponse(supplier))
            return res.status(HttpStatus.OK).send(response);
        }

        @Post("/:id/update")
        @UseGuards(AuthGuard())
        @UsePipes()
        async update( @Param('id', ParseIntPipe) supplierId: number, @Body(new ValidationPipe()) updateSupplierDTO: UpdateSupplierDTO , @GetAdminFromToken() adminToken: Admin, @Res() res: Response): Promise<any> {
            let response: ResponseData = new ResponseData();
            if(!adminToken){
                throw new HttpException(new ExceptionResponseDetail(HttpStatus.FORBIDDEN, `Không có quyền truy cập !`), HttpStatus.OK);
            }
           let supplier : Supplier = await this.supplierService.updateSupplier(supplierId ,updateSupplierDTO);
           response.setData(new SupplierDataResponse(supplier))
            return res.status(HttpStatus.OK).send(response);
        }

        @Get("/:id/detail")
        @UseGuards(AuthGuard())
        @UsePipes(new ValidationPipe({ transform: true }))
        async getDetail( @Param('id', ParseIntPipe) supplierId: number, @GetAdminFromToken() adminToken: Admin, @Res() res: Response): Promise<any> {
            let response: ResponseData = new ResponseData();
            if(!adminToken){
                throw new HttpException(new ExceptionResponseDetail(HttpStatus.FORBIDDEN, `Không có quyền truy cập !`), HttpStatus.OK);
            }
           let supplier : Supplier = await this.supplierService.findOneById(supplierId);
           if(!supplier){
            throw new HttpException(new ExceptionResponseDetail(HttpStatus.FORBIDDEN, `Nhà cung cấp không tồn tại !`), HttpStatus.OK);
           }
           response.setData(new SupplierDataResponse(supplier))
            return res.status(HttpStatus.OK).send(response);
        }

        @Post("/:id/change-status")
        @UseGuards(AuthGuard())
        @UsePipes(new ValidationPipe({ transform: true }))
        async changeStatus(@Param('id', ParseIntPipe) supplierId: number, @GetAdminFromToken() adminToken: Admin, @Res() res: Response){
            let response: ResponseData = new ResponseData();
            if(!adminToken){
            throw new HttpException(new ExceptionResponseDetail(HttpStatus.FORBIDDEN, `Nhà cung cấp không tồn tại !`), HttpStatus.OK);
            }
           let supplier : Supplier = await this.supplierService.findOneById(supplierId);
           if(supplier.status = SupplierStatusEnum.UN_AVAILABLE){
            supplier.status = SupplierStatusEnum.AVAILABLE
            await this.supplierService.update(supplier)
           }else{
            supplier.status = SupplierStatusEnum.UN_AVAILABLE
            await this.supplierService.update(supplier)
           }
           if(!supplier){
            throw new HttpException(new ExceptionResponseDetail(HttpStatus.FORBIDDEN, `Nhà cung cấp không tồn tại !`), HttpStatus.OK);
           }
           response.setData(new SupplierDataResponse(supplier))
            return res.status(HttpStatus.OK).send(response);
        }

}
