import { UtilsDate } from "src/utils.common/utils.format-time.common/utils.formar-time.common";
import { User } from "../users.entity/users.entity";

export class UserResponse{
 
    
    id : number;
    full_name : string;
    email : string;
    birthday : string;
    password : string;
    phone_number : string
    verify_code : string
    token : string
    created_at : string;
    updated_at : string;

    constructor(user : User) {
        this.id = user.id
        this.full_name = user.full_name;
        this.email = user.email
        this.token = user.token
        this.birthday = UtilsDate.formatDateTimeVNToString(user.birthday);
        this.password = user.password;
        this.phone_number = user.phone_number
        this.verify_code = user.verify_code
        this.created_at = UtilsDate.formatDateTimeVNToString(user.created_at);
        this.updated_at = UtilsDate.formatDateTimeVNToString(user.updated_at);
    }
}