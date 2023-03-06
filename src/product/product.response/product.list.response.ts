import { UtilsDate } from "src/utils.common/utils.format-time.common/utils.formar-time.common"
import { ProductDetailDataModel } from "../product.entity/product.detail.entity"


export class ProductDataResponse{

    id: number       
    supplier_id: number          
    supplier_name: string
    product_name: string   
    description: string     
    quantity: number        
    amount: number            
    discount_amount: number      
    discount_percent: number      
    status: number     
    size : number
    color : string
    image_urls : string
    created_at: string   
    updated_at: string      


    constructor( product ? : ProductDetailDataModel){
        this.id = product ? product.id : 0;       
        this.supplier_id = product ? product.supplier_id : 0;          
        this.supplier_name = product ? product.supplier_name : "";
        this.product_name = product ? product.product_name : "";   
        this.description = product ? product.description : "";     
        this.quantity = product ? product.quantity : 0;        
        this.amount = product ? product.amount : 0;            
        this.discount_amount = product ? product.discount_amount : 0;      
        this.discount_percent = product ? product.discount_percent : 0;      
        this.status = product ? product.status   : 0;       
        this.size = product ? product.size : 0;
        this.color = product ? product.color : "";
        this.image_urls = product ? JSON.parse(`${product.image_urls}`) : "[]";
        this.created_at = product ? UtilsDate.formatDateTimeVNToString(product.created_at) : '';
        this.updated_at = product ? UtilsDate.formatDateTimeVNToString(product.updated_at) : '';     
    }

    

    public mapToList(data: ProductDetailDataModel[]) {
        let response: ProductDataResponse[] = [];
        data.forEach(e => {
            response.push(new ProductDataResponse(e));
        })
        return response;
    }

}