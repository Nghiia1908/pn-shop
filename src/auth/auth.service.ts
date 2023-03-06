import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { ExceptionResponseDetail } from 'src/utils.common/utils.exceptions.common/utils.exception-common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(username: string, password: string) : Promise<any>{
    const user = await this.usersService.findOneByUsername(username);
    if(user && user.password === password){
        const { password, ...result } = user;
      return result;
    }
    throw new UnauthorizedException(new ExceptionResponseDetail(HttpStatus.BAD_REQUEST, "Mật khẩu không đúng ! , vui lòng nhập lại !"));
    }
}