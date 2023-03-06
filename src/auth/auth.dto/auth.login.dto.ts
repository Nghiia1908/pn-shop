import { IsEmpty, IsNotEmpty, Length } from 'class-validator';
import { IsNotEmptyString } from 'src/utils.common/utils.decorators.common/utils.decorators.common';
export class AuthLoginDTO {
    @IsNotEmptyString()
    readonly phone_number: string;

    @IsNotEmptyString()
    readonly password: string;
}