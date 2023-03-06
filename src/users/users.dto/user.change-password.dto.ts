import { IsNotEmptyString } from 'src/utils.common/utils.decorators.common/utils.decorators.common';
export class UserChangePasswordDTO {
    // Yêu cầu người dùng nhập 2 lần password
  
    @IsNotEmptyString()
    readonly old_password: string;
  
    @IsNotEmptyString()
    readonly new_password: string;

    @IsNotEmptyString()
    readonly confirm_password: string;

}