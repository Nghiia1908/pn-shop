import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity/users.entity';
import { Repository } from 'typeorm';
import { UserDTO } from './users.dto/user.create.dto';
import { ExceptionResponseDetail } from 'src/utils.common/utils.exceptions.common/utils.exception-common';
import { UserChangePasswordDTO } from './users.dto/user.change-password.dto';
import { GenerateToken } from 'src/utils.common/utils.generate-token.common/utils.generate-token.common';
import { HandleBase64 } from 'src/utils.common/utils.handle-base64.common/utils.handle-base64.common';
import { Password } from 'src/utils.common/utils.password.common/utils.password.common';
import { JwtService } from '@nestjs/jwt';
import { AuthTypeEnum } from 'src/auth/auth.enum/auth.enum';
import { UtilsDate } from 'src/utils.common/utils.format-time.common/utils.formar-time.common';
import { UserResetPasswordDTO } from './users.dto/user.reset-password.dto';
import { UserVerifyCodeDTO } from './users.dto/user.verify-code.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,  
        private jwtService: JwtService,
    ){ }

    
    

    async create(userDTO : UserDTO): Promise<User>{

        let user : User = new User();

        user.full_name = userDTO.full_name
        user.email = userDTO.email
        user.birthday = UtilsDate.formatStringDateToDate(userDTO.birthday)
        user.phone_number = userDTO.phone_number
        user.verify_code = ''
        user.password = userDTO.password
        user.token = ""

        await this.userRepository.create(user);
        // Tạo token từ mật khẩu và sđt người dùng (Generate Token By Phone And Password )
        
        let passwordBasic: string = await HandleBase64.decodePasswordBase64(user.password);
        let generateToken = new GenerateToken(user.phone_number, passwordBasic, AuthTypeEnum.USER);
        user.token = await this.jwtService.sign(JSON.stringify(generateToken));

        // Mã hóa mật khẩu 
        
        user.password = String(await Password.bcryptPassword(passwordBasic));
        
        
        await this.userRepository.save(user);

        
        return user;
    }

    async changePassword(userChangePasswordDTO: UserChangePasswordDTO, userId: number): Promise<User> {
        let user: User = await this.findOneById(userId);

        // Kiểm tra mật khẩu cũ có đúng không

        if (!(await Password.comparePassword(await HandleBase64.decodePasswordBase64(userChangePasswordDTO.old_password), user.password))) {
            throw new HttpException(new ExceptionResponseDetail(HttpStatus.FORBIDDEN, `Mật khẩu cũ không đúng!`,), HttpStatus.OK);
        } else {
            if (userChangePasswordDTO.new_password != userChangePasswordDTO.confirm_password) {
                throw new HttpException(new ExceptionResponseDetail(HttpStatus.BAD_REQUEST, `Mật khẩu không đúng!`), HttpStatus.OK);
            } else {
                let newPassword: string = await HandleBase64.decodePasswordBase64(userChangePasswordDTO.new_password);

                let generateToken = new GenerateToken(user.phone_number, newPassword, AuthTypeEnum.USER);
                user.token = await this.jwtService.sign(JSON.stringify(generateToken));
                user.password = String(await Password.bcryptPassword(newPassword));
                await this.update(user)

            }
        }

        return user;
    }
    
    // Gửi email cho người dùng

    async tranportEmail(email : string , verify_code : string): Promise<any>{
        var nodemailer = require('nodemailer');
        const optionEmail = {
            service: process.env.EMAIL_SERVICE,
                auth: {
                    user: process.env.EMAIL_USER, // email hoặc username
                    pass: process.env.EMAIL_PASSWORD // password
                }
            };

        var transporter = nodemailer.createTransport(optionEmail);
        transporter.verify(function(error) {
        if (error) {
            console.log(error);
        } else { 
            console.log('Kết nối  đến gmail thành công!');
            var mail = {
                from: process.env.EMAIL_USER, 
                to: email, 
                subject: 'MÃ XÁC NHẬN THAY ĐỔI MẬT KHẨU', 
                text:  verify_code + ' là mã xác nhận thay đổi mật khẩu của bạn .', 
                // text: 'I LÒ VÉ EM  : ', 
            };
        }

        transporter.sendMail(mail, function(error, info) {
            if (error) { // nếu có lỗi
                console.log(error);
            } else { //nếu thành công
                console.log("Gửi gmail thành công !");
            }
        });
        
        });
        return 1;
    }


    async verifyCode(userVerifyCodeDTO: UserVerifyCodeDTO): Promise<User>{
        let user = await this.findOneByPhone(userVerifyCodeDTO.phone_number)
        if(user.verify_code != userVerifyCodeDTO.verify_code){
            throw new HttpException(new ExceptionResponseDetail(HttpStatus.BAD_REQUEST, `Mã code: [${userVerifyCodeDTO.verify_code}] không đúng!`), HttpStatus.OK);
        }else{
            let passwordBasic= "0000";
            user.password = String(await Password.bcryptPassword(passwordBasic));
            let generateToken = new GenerateToken(user.phone_number, passwordBasic, AuthTypeEnum.USER);
            user.token = await this.jwtService.sign(JSON.stringify(generateToken));
            this.update(user);
            return user ;
        }
       
    }

    async findOneById(id: number): Promise<User> {
        return await this.userRepository.findOneBy({ id});
      }

    async findOneByPhone(phone_number: string): Promise<User> {
        return await this.userRepository.findOneBy({ phone_number});
    }

    async findOneByUsername(full_name: string): Promise<User> {
        return await this.userRepository.findOneBy({ full_name});
    }

    async update(user: User): Promise<User> {
        return await this.userRepository.save(user);
    }
}
