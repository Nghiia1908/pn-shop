import { UtilsDate } from "src/utils.common/utils.format-time.common/utils.formar-time.common"
import { ProductDetailDataModel } from "../product.entity/product.detail.entity"
import { Product } from "../product.entity/product.entity"


export class ProductResponse{

    id: number       
    supplier_id: number  
    name: string   
    description: string     
    quantity: number        
    amount: number            
    discount_amount: number      
    discount_percent: number      
    status: number       
    created_at: string   
    updated_at: string      


    constructor( product ? : Product){
        this.id = product ? product.id : 0;       
        this.supplier_id = product ? product.supplier_id : 0;          
        this.name = product ? product.name : "";   
        this.description = product ? product.description : "";     
        this.quantity = product ? product.quantity : 0;        
        this.amount = product ? product.amount : 0;            
        this.discount_amount = product ? product.discount_amount : 0;      
        this.discount_percent = product ? product.discount_percent : 0;      
        this.status = product ? product.status   : 0;       
        this.created_at = product ? UtilsDate.formatDateTimeVNToString(product.created_at) : '';
        this.updated_at = product ? UtilsDate.formatDateTimeVNToString(product.updated_at) : '';     
    }

    

    public mapToList(data: Product[]) {
        let response: ProductResponse[] = [];
        data.forEach(e => {
            response.push(new ProductResponse(e));
        })
        return response;
    }

}