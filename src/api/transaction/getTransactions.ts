import baseApi from "..";
import { config } from "../../config";
import { handleAxiosError } from "../error"

export interface GetTransaction {
    token: string
}

export const getTransactions = async (payload: GetTransaction) => {
    try {
        const header = {
            Authorization: `Bearer ${payload.token}`
        }
        const responses = await baseApi.get(config.transaction.path + config.transaction.getTransaction, {headers: header})

        return responses.data;
    } catch (error) {
        const responses = handleAxiosError(error, 'error while fetch transaction');
        return responses;
    }
}