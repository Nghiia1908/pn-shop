import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthTypeEnum } from 'src/auth/auth.enum/auth.enum';
import { ExceptionResponseDetail } from 'src/utils.common/utils.exceptions.common/utils.exception-common';
import { UtilsDate } from 'src/utils.common/utils.format-time.common/utils.formar-time.common';
import { GenerateToken } from 'src/utils.common/utils.generate-token.common/utils.generate-token.common';
import { HandleBase64 } from 'src/utils.common/utils.handle-base64.common/utils.handle-base64.common';
import { Password } from 'src/utils.common/utils.password.common/utils.password.common';
import { Repository } from 'typeorm';
import { AdminChangePasswordDTO } from './admin.dto/admin.change-password.dto';
import { CreateAdminDTO } from './admin.dto/admin.create.dto';
import { UpdateAdminDTO } from './admin.dto/admin.update.dto';
import { Admin } from './admin.entity/admin.entity';

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(Admin)
        private adminRepository: Repository<Admin>,  
        private jwtService: JwtService,
    ){ }

    async createAdmin(createAdminDTO : CreateAdminDTO) : Promise<Admin> {
        
        let admin : Admin = new Admin();

        admin.first_name = createAdminDTO.first_name
        admin.last_name = createAdminDTO.last_name
        admin.full_name = createAdminDTO.full_name
        admin.birthday = UtilsDate.formatStringDateToDate(createAdminDTO.birthday)
        admin.phone_number = createAdminDTO.phone_number
        admin.email = createAdminDTO.email
        admin.password = createAdminDTO.password
        admin.token = ""

        await this.adminRepository.create(admin);

        // Tạo token từ mật khẩu và sđt người dùng (Generate Token By Phone And Password )

        let passwordBasic: string = await HandleBase64.decodePasswordBase64(admin.password);
        let generateToken = new GenerateToken(admin.phone_number, passwordBasic, AuthTypeEnum.ADMIN);
        admin.token = await this.jwtService.sign(JSON.stringify(generateToken));
        admin.password = String(await Password.bcryptPassword(passwordBasic));
        
        await this.adminRepository.save(admin);
        return admin;
    }

    async changePassword(adminChangePasswordDTO: AdminChangePasswordDTO, adminId: number): Promise<Admin> {
        let admin: Admin = await this.findOneById(adminId);

        if(admin == null){
            throw new HttpException(new ExceptionResponseDetail(HttpStatus.BAD_REQUEST, `Người dùng không tồn tại!`), HttpStatus.OK);
        }
        // Kiểm tra mật khẩu cũ có đúng không
        if (!(await Password.comparePassword(await HandleBase64.decodePasswordBase64(adminChangePasswordDTO.old_password), admin.password))) {
            throw new HttpException(new ExceptionResponseDetail(HttpStatus.FORBIDDEN, `Mật khẩu cũ không đúng!`,), HttpStatus.OK);
        } else {
            if (adminChangePasswordDTO.new_password != adminChangePasswordDTO.confirm_password) {
                throw new HttpException(new ExceptionResponseDetail(HttpStatus.BAD_REQUEST, `Mật khẩu không đúng!`), HttpStatus.OK);
            } else {
                let newPassword: string = await HandleBase64.decodePasswordBase64(adminChangePasswordDTO.new_password);

                let generateToken = new GenerateToken(admin.phone_number, newPassword, AuthTypeEnum.ADMIN);
                admin.token = await this.jwtService.sign(JSON.stringify(generateToken));
                admin.password = String(await Password.bcryptPassword(newPassword));
                await this.update(admin)
            }
        }
        return admin;
    }

    async updateAdmin(updateAdminDTO : UpdateAdminDTO , adminId : number): Promise<Admin> {
        let admin : Admin = await this.findOneById(adminId);
        if(!admin){
            throw new HttpException(new ExceptionResponseDetail(HttpStatus.BAD_REQUEST, `Người dùng không tồn tại!`), HttpStatus.OK);
        }
        admin.first_name = updateAdminDTO.first_name
        admin.last_name = updateAdminDTO.last_name
        admin.full_name = updateAdminDTO.full_name
        admin.birthday = UtilsDate.formatStringDateToDate(updateAdminDTO.birthday)
        this.update(admin);

        return admin;
    }

    async findOneById(id: number): Promise<Admin> {
        return await this.adminRepository.findOneBy({ id});
      }

    async findOneByEmail(email: string): Promise<Admin> {
        return await this.adminRepository.findOneBy({ email});
    }

    async findOneByPhone(phone_number: string): Promise<Admin> {
        return await this.adminRepository.findOneBy({ phone_number});
    }

    async update(admin: Admin): Promise<Admin> {
        return await this.adminRepository.save(admin);
    }
}
