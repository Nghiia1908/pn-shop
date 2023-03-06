import { UtilsDate } from "src/utils.common/utils.format-time.common/utils.formar-time.common"
import { Supplier } from "../supplier.entity/supplier.entity"

export class SupplierDataResponse{
    id : number
    name : string
    description : string
    email : string
    phone_number : string
    status : number
    created_at : string
    updated_at : string

    constructor( supplier ? : Supplier){
        this.id  = supplier ? supplier.id : 0
        this.name = supplier ?  supplier.name : ''
        this.description = supplier ?  supplier.description : ''  
        this.email = supplier ?  supplier.email : ''   
        this.phone_number = supplier ? supplier.phone_number : ''   
        this.status = supplier ? supplier.status : 0
        this.created_at = supplier ? UtilsDate.formatDateTimeVNToString(supplier.created_at) : '';
        this.updated_at = supplier ? UtilsDate.formatDateTimeVNToString(supplier.updated_at) : ''; 
    }

    public mapToList(data: Supplier[]) {
        let response: SupplierDataResponse[] = [];
        data.forEach(e => {
            response.push(new SupplierDataResponse(e));
        })
        return response;
    }
}