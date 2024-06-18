import baseApi from "..";
import { config } from "../../config";
import { handleAxiosError } from "../error"

export interface CreateTranasction {
    token: string
    instruction: string
    transferAt?: string
    transactionList: TransactionList[]
}

interface TransactionList {
    amount: number,
    userDestinationId: string,
    corporateDestinationId: string,
}

export const createTransaction = async (payload: CreateTranasction) => {
    try {
        const header = {
            Authorization: `Bearer ${payload.token}`
        }
        const responses = await baseApi.post(config.transaction.path + config.transaction.createTransaction,
            payload,
            {headers: header},
        )

        return responses.data;
    } catch (error) {
        const responses = handleAxiosError(error, 'error while fetch transaction');
        return responses;
    }
}