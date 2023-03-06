import { UtilsDate } from "src/utils.common/utils.format-time.common/utils.formar-time.common"
import { Wallet } from "../wallet.entity/wallet.entity"

export class WalletResponse {

    id: number
    user_id: number
    total_amount: number
    created_at: string
    updated_at: string

    constructor(wallet?: Wallet) {

        this.id = wallet ? wallet.id : 0
        this.user_id = wallet ? wallet.user_id : 0
        this.total_amount = wallet ? wallet.total_amount : 0
        this.created_at = wallet ? UtilsDate.formatDateTimeVNToString(wallet.created_at) : ''
        this.updated_at = wallet ? UtilsDate.formatDateTimeVNToString(wallet.updated_at) : ''
    }

    public mapToList(data: Wallet[]) {
        let response: WalletResponse[] = [];
        data.forEach(e => {
            response.push(new WalletResponse(e));
        })
        return response;
    }

}