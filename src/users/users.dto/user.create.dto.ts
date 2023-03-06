import { IsString, Length } from 'class-validator';
import { IsNotEmptyString } from 'src/utils.common/utils.decorators.common/utils.decorators.common';
// import { IsNotEmptyString } from 'src/utils.common/utils.decorators.common/utils.decorators.common';

export class UserDTO {
    @Length(1, 70)
    @IsNotEmptyString()
    readonly full_name: string;

    @Length(1, 70)
    @IsNotEmptyString()
    readonly email: string;

    @Length(1, 70)
    @IsNotEmptyString()
    readonly birthday: string;

    @Length(1, 70)
    @IsNotEmptyString()
    readonly phone_number: string;

    @Length(1, 70)
    @IsNotEmptyString()
    readonly password: string;

}