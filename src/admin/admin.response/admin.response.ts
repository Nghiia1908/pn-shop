import { UtilsDate } from "src/utils.common/utils.format-time.common/utils.formar-time.common";
import { Admin } from "../admin.entity/admin.entity";
export class AdminResponse{

    id : number;
    first_name : string;
    last_name : string;
    full_name : string;
    email : string;
    phone_number : string;
    birthday: string;
    password : string;
    token : string;
    created_at : string;
    updated_at : string;

    constructor(admin : Admin) {
        this.id = admin.id
        this.first_name = admin.first_name
        this.last_name = admin.last_name
        this.full_name = admin.full_name;
        this.email = admin.email
        this.phone_number = admin.phone_number
        this.birthday = UtilsDate.formatDateTimeVNToString(admin.birthday);
        this.password = admin.password;
        this.token = admin.token
        this.created_at = UtilsDate.formatDateTimeVNToString(admin.created_at);
        this.updated_at = UtilsDate.formatDateTimeVNToString(admin.updated_at);
    }
}