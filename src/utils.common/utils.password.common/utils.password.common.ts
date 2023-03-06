import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ExceptionResponseDetail } from '../utils.exceptions.common/utils.exception-common';


export class Password {
    private password: string;

    constructor(password?: string) {
        this.password = password;
    }


    // Mã hóa mật khẩu khi client truyền vào 

    static async bcryptPassword(password: string): Promise<string> {

        if (!password) {
            throw new HttpException(new ExceptionResponseDetail(HttpStatus.BAD_REQUEST, "password không hợp lệ!"), HttpStatus.OK);
        } else {

            let saltRound: number = 10;
            let salt: string = await bcrypt.genSaltSync(saltRound);
            let hash: string = await bcrypt.hashSync(password, salt);
            return hash;
        }
    }

    /**
     * 
     * @param password là password nguyên bản mà client nhập (ví dụ: 123456)
     * @param bcryptPassword là password đã được mã hóa thành bcrypt
     * @returns boolean
     */

    // compare 2 mật khẩu và kiểm tra xem có trùng khớp hay không ? 

    static async comparePassword(password: string, bcryptPassword: string): Promise<boolean> {
        if (!password || !bcryptPassword) {      
            throw new HttpException(new ExceptionResponseDetail(HttpStatus.BAD_REQUEST, "password không hợp lệ!"), HttpStatus.OK);
        } else {
            let comParePassword: boolean = await bcrypt.compareSync(password, bcryptPassword);
            return comParePassword;
        }
    }
}