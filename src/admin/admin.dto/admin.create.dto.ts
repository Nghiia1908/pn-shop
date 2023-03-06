import { Length } from "class-validator";
import { IsNotEmptyString } from "src/utils.common/utils.decorators.common/utils.decorators.common";

export class CreateAdminDTO {
    @IsNotEmptyString()
    readonly first_name: string;

    @IsNotEmptyString()
    readonly last_name : string;

    @IsNotEmptyString()
    readonly full_name : string;

    @IsNotEmptyString()
    readonly email : string;

    @Length(1, 70)
    @IsNotEmptyString()
    readonly birthday : string;

    @IsNotEmptyString()
    readonly phone_number : string;

    @IsNotEmptyString()
    readonly password : string;

}