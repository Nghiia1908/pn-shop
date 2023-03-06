import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExceptionResponseDetail } from 'src/utils.common/utils.exceptions.common/utils.exception-common';
import { ExceptionStoreProcedure } from 'src/utils.common/utils.exceptions.common/utils.store-procedure-exception.common';
import { Pagination } from 'src/utils.common/utils.pagination.common/utils.pagination.common';
import { StoreProcedureResult } from 'src/utils.common/utils.store-procedure-result.common/utils.store-procedure-result.common';
import { StoreProcedureResultInterface } from 'src/utils.common/utils.store-procedure-result.common/utils.store-procedure-result.interface.common';
import { Repository } from 'typeorm';
import { Wallet } from './wallet.entity/wallet.entity';

@Injectable()
export class WalletService {


    constructor(
        @InjectRepository(Wallet)
        private wallet: Repository<Wallet>
    ) {

    }

    async createWalletForUser(userId: number, amount: number) {
        let result = await this.wallet.query('CALL sp_create_wallet_for_user(?,?,@status,@message); SELECT @status AS status , @message AS message',
            [
                userId,
                amount
            ])

        ExceptionStoreProcedure.validate(result);
        let walletHistory: Wallet = new StoreProcedureResult<Wallet>().getResultDetail(result)
        return walletHistory;
    }

}