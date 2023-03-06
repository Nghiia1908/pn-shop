import { IsInt, IsString, Length } from "class-validator";
import { IsNotEmptyString } from "src/utils.common/utils.decorators.common/utils.decorators.common";
export class CreateProductDTO
{
    @IsInt()
    readonly supplier_id: number = -1;

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