import { IsNotEmptyString } from "src/utils.common/utils.decorators.common/utils.decorators.common";

export class UpdateAdminDTO{

    @IsNotEmptyString()
    readonly first_name : string;

    @IsNotEmptyString()
    readonly last_name : string;

    @IsNotEmptyString()
    readonly full_name : string;

    @IsNotEmptyString()
    readonly birthday : string;
}