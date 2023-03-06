import { BadRequestException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Admin } from "src/admin/admin.entity/admin.entity";
import { AdminService } from "src/admin/admin.service";
import { User } from "src/users/users.entity/users.entity";
import { UsersService } from "src/users/users.service";
import { ExceptionResponseDetail } from "src/utils.common/utils.exceptions.common/utils.exception-common";
// import { ExceptionResponseDetail } from "src/utils.common/utils.exceptions.common/utils.exception-common"; 
import { AuthTypeEnum } from "./auth.enum/auth.enum";
import { AuthService } from "./auth.service";


@Injectable()

export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private userService: UsersService,
        private adminService: AdminService,
        private authService: AuthService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: '1235sd-5656sdf-@dfkdf-sdsjfdj',
        });
    }




    async validate(generateToken): Promise<User| Admin> {
        
        if (generateToken.type === AuthTypeEnum.USER) {
            const user: User = await this.userService.findOneByPhone(generateToken.phone_number);
            if (!user) {
                throw new UnauthorizedException(new ExceptionResponseDetail(HttpStatus.BAD_REQUEST, "Token không hợp lệ!"));
            }
            return user;
        }
        else {
            const admin: Admin = await this.adminService.findOneByEmail(generateToken.phone_number);
            if (!admin) {
                throw new UnauthorizedException(new ExceptionResponseDetail(HttpStatus.BAD_REQUEST, "Token không hợp lệ!"));
            }
            return admin;
        }
    }
}