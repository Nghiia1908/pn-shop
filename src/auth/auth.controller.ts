import {
    Body,
    Controller,
    HttpException,
    HttpStatus,
    Post,
    Res,
    ValidationPipe
  } from '@nestjs/common';
  import { Response } from 'express';
import { Admin } from 'src/admin/admin.entity/admin.entity';
import { AdminResponse } from 'src/admin/admin.response/admin.response';
import { AdminService } from 'src/admin/admin.service';
import { User } from 'src/users/users.entity/users.entity';
import { UserResponse } from 'src/users/users.response/user.response';
import { UsersService } from 'src/users/users.service';
import { ExceptionResponseDetail } from 'src/utils.common/utils.exceptions.common/utils.exception-common';
import { HandleBase64 } from 'src/utils.common/utils.handle-base64.common/utils.handle-base64.common';
import { Password } from 'src/utils.common/utils.password.common/utils.password.common';
import { ResponseData } from 'src/utils.common/utils.response.common/utils.response.common';
import { AuthLoginDTO } from './auth.dto/auth.login.dto';

@Controller('api/auth')
export class AuthController {
    constructor(
        private userService: UsersService,
        private adminService : AdminService
        // private adminService: AdminService,
      ) { }
    

      @Post('user-login')
      async userLogin(@Body(new ValidationPipe()) authLoginDTO: AuthLoginDTO,@Res() res: Response,): Promise<any> {
        let response: ResponseData = new ResponseData();
        let user: User = await this.userService.findOneByPhone(authLoginDTO.phone_number);
        console.log(user);
        
        if(!user){
            throw new HttpException(new ExceptionResponseDetail(HttpStatus.FORBIDDEN,`Số điện thoại ${authLoginDTO.phone_number} không đúng!`,), HttpStatus.OK);
        }else{
            if (
                !(await Password.comparePassword(
                  await HandleBase64.decodePasswordBase64(authLoginDTO.password),
                  user.password,
                ))
              ) {
                throw new HttpException(
                  new ExceptionResponseDetail(
                    HttpStatus.FORBIDDEN,
                    `Mật khẩu không đúng!`,
                  ), HttpStatus.OK
                );
              } else {
                response.setData(new UserResponse(user));
              }
        }
        return res.status(HttpStatus.OK).send(response);
      }

    @Post('admin-login')
    async adminLogin(@Body(new ValidationPipe()) authLoginDTO: AuthLoginDTO,@Res() res: Response,): Promise<any> {
    let response: ResponseData = new ResponseData();
    let admin: Admin = await this.adminService.findOneByPhone(authLoginDTO.phone_number);
    // console.log(await Password.comparePassword(
    //   await HandleBase64.decodePasswordBase64(authLoginDTO.password),
    //   admin.password));
    if (!admin) {
      throw new HttpException(
        new ExceptionResponseDetail(
          HttpStatus.FORBIDDEN,
          `Tài khoản [${authLoginDTO.phone_number}] không đúng!`,
        ), HttpStatus.OK
      ); 
    } else {
      if (
        !(await Password.comparePassword(
          await HandleBase64.decodePasswordBase64(authLoginDTO.password),
          admin.password)
          ) 
      )
       {
        throw new HttpException(
          new ExceptionResponseDetail(
            HttpStatus.FORBIDDEN,
            `Mật khẩu không đúng!`,
          ), HttpStatus.OK
        );
      } else {
        response.setData(new AdminResponse(admin)); 
      }
    }
    
    return res.status(HttpStatus.OK).send(response);
  }
}
