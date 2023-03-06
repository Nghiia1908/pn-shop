import { IsInt, IsString, Length } from "class-validator";
import { IsNotEmptyString } from "src/utils.common/utils.decorators.common/utils.decorators.common";
export class UpdateProductDTO
{

    @IsNotEmptyString() 
    name : string ;

    @IsNotEmptyString() 
    description : string ;

    @IsInt()
    quantity : number;

    @IsInt()
    amount : number;
    
    @IsInt()
    discount_percent : number;
    
    @IsInt()
    discount_amount : number;

}