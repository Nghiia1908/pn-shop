import { Body, Controller, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { ExceptionResponseDetail } from 'src/utils.common/utils.exceptions.common/utils.exception-common';
import { GetUserFromToken, RequestHeaderVerifyApiKey } from 'src/utils.common/utils.decorators.common/utils.decorators.common';
import { UtilsDate } from 'src/utils.common/utils.format-time.common/utils.formar-time.common';
import { ResponseData } from 'src/utils.common/utils.response.common/utils.response.common';
import { UserChangePasswordDTO } from './users.dto/user.change-password.dto';
import { UserDTO } from './users.dto/user.create.dto';
import { User } from './users.entity/users.entity';
import { UserResponse } from './users.response/user.response';
import { UsersService } from './users.service';
import { UserResetPasswordDTO } from './users.dto/user.reset-password.dto';
import { UserVerifyCodeDTO } from './users.dto/user.verify-code.dto';
import { UserVerifyEnum } from './user.enum/user.verify.enum';
import * as moment from 'moment';
import { use } from 'passport';

@Controller('/api/users')
export class UsersController {
    constructor(
        private usersService: UsersService
    ) { }

    @Post("/register")
    @UsePipes()
    async create(@Body(new ValidationPipe()) userDTO: UserDTO, @Res() res: Response): Promise<any> {
        let response: ResponseData = new ResponseData();
        let userPhone: User = await this.usersService.findOneByPhone(userDTO.phone_number);
        if(userPhone){
            throw new HttpException(new ExceptionResponseDetail(HttpStatus.FORBIDDEN, `Số điện thoại đã được đăng ký !`), HttpStatus.BAD_REQUEST);
        }
        else{
            let user: User = await this.usersService.create(userDTO);
            if (user == undefined) {
                throw new HttpException(new ExceptionResponseDetail(HttpStatus.BAD_REQUEST, "Tạo thành viên thất bại!"), HttpStatus.OK);
            } else {
            response.setData(new UserResponse(user));
            }
        }  
        return res.status(HttpStatus.OK).send(response);
    // }
}

    @Post("/change-password")
    @UseGuards(AuthGuard())
    @UsePipes()
    async changePassword(@Body(new ValidationPipe()) userChangePasswordDTO: UserChangePasswordDTO, @GetUserFromToken() user: User, @Res() res: Response): Promise<any> {
        let response: ResponseData = new ResponseData();
             if (user.id == null) {
            throw new HttpException(new ExceptionResponseDetail(HttpStatus.FORBIDDEN, `Khách hàng Không hợp lệ!`), HttpStatus.OK);
        }
        let userInformation: User = await this.usersService.findOneById(user.id);
        console.log(userInformation);
        
        if (userInformation == null) {
            throw new HttpException(new ExceptionResponseDetail(HttpStatus.FORBIDDEN, `Người dùng không hợp lệ!`), HttpStatus.OK);
        } else {
            user = await this.usersService.changePassword(userChangePasswordDTO, user.id);
        }
        return res.status(HttpStatus.OK).send(response);
    }

    @Get("/detail")
    @UseGuards(AuthGuard())
    @UsePipes()
    async getUserDetail(@GetUserFromToken() user: User, @Res() res: Response): Promise<any> {
        let response: ResponseData = new ResponseData();
        if(user == null){
            throw new HttpException(new ExceptionResponseDetail(HttpStatus.FORBIDDEN, `Khách hàng Không hợp lệ!`), HttpStatus.OK);
        }
        let userInformation: User = await this.usersService.findOneById(user.id);
        if (userInformation == null) {
            throw new HttpException(new ExceptionResponseDetail(HttpStatus.FORBIDDEN, `Không tìm thấy thông tin người dùng!`), HttpStatus.OK);
        } else {
            response.setData(new UserResponse(user));
        }
        return res.status(HttpStatus.OK).send(response)
    }

    @Post('/forgot-password')
    @UsePipes()
    async ResetPassword(@Body(new ValidationPipe()) userResetPasswordDTO: UserResetPasswordDTO, @Res() res: Response): Promise<any> {
        let response: ResponseData = new ResponseData();
        let user = await this.usersService.findOneByPhone(userResetPasswordDTO.phone_number)
        if(!user){
            throw new HttpException(new ExceptionResponseDetail(HttpStatus.FORBIDDEN, `Số điện thoại [${userResetPasswordDTO.phone_number}] không tồn tại !`), HttpStatus.OK);
        }
        else{
            if(userResetPasswordDTO.email != user.email){
                throw new HttpException(new ExceptionResponseDetail(HttpStatus.FORBIDDEN, `Gmail không hợp lệ !`), HttpStatus.OK);
            } 
            let date = moment();
            if (date.diff(user.is_verify_code_at) < 30000) {
                throw new HttpException(new ExceptionResponseDetail(HttpStatus.BAD_REQUEST, `Vui lòng chờ thêm ${30 - date.diff(user.is_verify_code_at) / 1000}s !`), HttpStatus.OK);
            }
            else{
                user.verify_code = String(Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000);
                user.is_verify_code_at = new Date();
                this.usersService.update(user)
                // Gửi mã xác nhận tới gmail của người dùng 
                this.usersService.tranportEmail(user.email,user.verify_code);
                response.setData("Mã xác thực đã được gửi đến gmail của bạn , vui lòng xác thực !")
                return res.status(HttpStatus.OK).send(response)
            }
        }
    }

    @Post("verify-code")
    @UseGuards(ValidationPipe)
    async verifyCode(@Body() userVerifyCodeDTO: UserVerifyCodeDTO, @Res() res: Response): Promise<any> {
        let response: ResponseData = new ResponseData();
        let userPhone: User = await this.usersService.findOneByPhone(userVerifyCodeDTO.phone_number);
        if (!userPhone) {
            throw new HttpException(new ExceptionResponseDetail(HttpStatus.BAD_REQUEST, `Số điện thoại [${userVerifyCodeDTO.phone_number}] chưa hợp lệ!`), HttpStatus.OK);
        } else {
            let user: User = await this.usersService.verifyCode(userVerifyCodeDTO);
            if (user == undefined) {
                throw new HttpException(new ExceptionResponseDetail(HttpStatus.BAD_REQUEST, "Đăng kí thành viên thất bại!"), HttpStatus.OK);
            } else {
                user.verify_code = "";
                this.usersService.update(user);
                response.setData("Mật khẩu của bạn là : 0000 , vui lòng thay đổi mật khẩu !")
               
            }
        }
        return res.status(HttpStatus.OK).send(response);
    }

}
