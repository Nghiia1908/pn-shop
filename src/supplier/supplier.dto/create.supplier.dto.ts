import { IsInt, IsString, Length } from "class-validator";
import { IsNotEmptyString } from "src/utils.common/utils.decorators.common/utils.decorators.common";
export class CreateSupplierDTO{

    @IsNotEmptyString() 
    name : string ;

    @IsNotEmptyString() 
    description : string = '';

    @IsNotEmptyString() 
    email : string ;

    @IsNotEmptyString() 
    phone_number : string ;

}